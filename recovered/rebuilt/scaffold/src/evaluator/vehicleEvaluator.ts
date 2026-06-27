// Standalone evaluator algorithm for recovered scaffold use.

export type TitleStatus = "clean" | "rebuilt" | "salvage" | "lemon";

export type VehicleEvaluationInput = {
  baseMarketValue: number;
  year: number;
  mileage: number;
  conditionScore: number; // 1-10
  accidentCount: number;
  serviceHistoryRatio: number; // 0-1
  titleStatus: TitleStatus;
  demandIndex: number; // 0-1
  locationFactor?: number; // default 1.0
  photoQualityScore?: number; // 0-1, optional confidence booster
};

export type VehicleEvaluationResult = {
  score: number; // 0-100
  adjustedValue: number;
  offerBand: {
    low: number;
    target: number;
    high: number;
  };
  recommendation: "buy" | "negotiate" | "pass";
  confidence: number; // 0-1
  reasons: string[];
};

const CURRENT_YEAR = new Date().getUTCFullYear();

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function titleMultiplier(status: TitleStatus): number {
  switch (status) {
    case "clean":
      return 1.0;
    case "rebuilt":
      return 0.82;
    case "salvage":
      return 0.65;
    case "lemon":
      return 0.72;
    default:
      return 0.8;
  }
}

function pushTopReasons(entries: Array<{ label: string; impact: number }>, maxCount: number): string[] {
  return entries
    .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
    .slice(0, maxCount)
    .map((entry) => entry.label);
}

export function evaluateVehicle(input: VehicleEvaluationInput): VehicleEvaluationResult {
  const year = Math.max(1980, Math.min(input.year, CURRENT_YEAR));
  const age = Math.max(0, CURRENT_YEAR - year);
  const mileage = Math.max(0, input.mileage);
  const baseMarketValue = Math.max(0, input.baseMarketValue);

  const conditionNorm = clamp(input.conditionScore / 10, 0, 1);
  const serviceNorm = clamp(input.serviceHistoryRatio, 0, 1);
  const demandNorm = clamp(input.demandIndex, 0, 1);
  const locationFactor = clamp(input.locationFactor ?? 1.0, 0.8, 1.2);
  const photoNorm = clamp(input.photoQualityScore ?? 0.7, 0, 1);

  const agePenalty = clamp(age / 20, 0, 0.7);
  const mileagePenalty = clamp(mileage / 250000, 0, 0.8);
  const accidentPenalty = clamp(input.accidentCount * 0.08, 0, 0.35);
  const titleMult = titleMultiplier(input.titleStatus);

  const weightedHealth = clamp(
    0.45 * conditionNorm +
      0.2 * serviceNorm +
      0.2 * (1 - mileagePenalty) +
      0.15 * (1 - agePenalty),
    0,
    1,
  );

  const riskPenalty = clamp(accidentPenalty + (1 - titleMult) * 0.7, 0, 0.7);
  const marketBoost = 0.85 + demandNorm * 0.35;

  const adjustedValueRaw =
    baseMarketValue * weightedHealth * titleMult * (1 - riskPenalty) * marketBoost * locationFactor;

  const adjustedValue = roundMoney(Math.max(0, adjustedValueRaw));

  const score = Math.round(
    clamp(
      100 * (0.55 * weightedHealth + 0.2 * demandNorm + 0.1 * photoNorm + 0.15 * (1 - riskPenalty)),
      0,
      100,
    ),
  );

  const confidence = clamp(
    0.55 + 0.2 * serviceNorm + 0.1 * photoNorm + (input.accidentCount === 0 ? 0.1 : 0) - agePenalty * 0.08,
    0.25,
    0.98,
  );

  const spread = clamp(0.2 - confidence * 0.08 + riskPenalty * 0.12, 0.1, 0.28);
  const offerTarget = adjustedValue;
  const offerLow = roundMoney(offerTarget * (1 - spread));
  const offerHigh = roundMoney(offerTarget * (1 + spread * 0.55));

  let recommendation: VehicleEvaluationResult["recommendation"] = "pass";
  if (score >= 75 && confidence >= 0.58) {
    recommendation = "buy";
  } else if (score >= 52) {
    recommendation = "negotiate";
  }

  const reasons = pushTopReasons(
    [
      { label: `Condition score ${input.conditionScore}/10`, impact: conditionNorm - 0.5 },
      { label: `Age ${age} years`, impact: -(agePenalty + 0.05) },
      { label: `Mileage ${mileage.toLocaleString()} mi`, impact: -(mileagePenalty + 0.03) },
      { label: `Accidents ${input.accidentCount}`, impact: -(accidentPenalty + 0.02) },
      { label: `Title status ${input.titleStatus}`, impact: titleMult - 1 },
      { label: `Service history ${(serviceNorm * 100).toFixed(0)}%`, impact: serviceNorm - 0.5 },
      { label: `Demand index ${(demandNorm * 100).toFixed(0)}%`, impact: demandNorm - 0.5 },
    ],
    4,
  );

  return {
    score,
    adjustedValue,
    offerBand: {
      low: offerLow,
      target: offerTarget,
      high: offerHigh,
    },
    recommendation,
    confidence: Math.round(confidence * 100) / 100,
    reasons,
  };
}
