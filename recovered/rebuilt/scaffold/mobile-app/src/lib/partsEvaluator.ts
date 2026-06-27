export type PartCondition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type PartEvaluationInput = {
  estimatedRetailPrice: number;
  conditionScore: PartCondition;
  demandIndex: number; // 0..1
  daysOnShelf: number;
  hasFitmentDetails: boolean;
  photoQualityScore: number; // 0..1
  returnsRisk: number; // 0..1
};

export type PartEvaluationResult = {
  score: number;
  offerBand: {
    low: number;
    target: number;
    high: number;
  };
  recommendation: "buy" | "negotiate" | "pass";
  confidence: number;
  reasons: string[];
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function evaluatePart(input: PartEvaluationInput): PartEvaluationResult {
  const retail = Math.max(0, input.estimatedRetailPrice);
  const condition = clamp(input.conditionScore / 10, 0, 1);
  const demand = clamp(input.demandIndex, 0, 1);
  const shelfPenalty = clamp(input.daysOnShelf / 365, 0, 0.45);
  const fitmentBoost = input.hasFitmentDetails ? 0.08 : -0.05;
  const photo = clamp(input.photoQualityScore, 0, 1);
  const returnsRisk = clamp(input.returnsRisk, 0, 1);

  const quality = clamp(0.5 * condition + 0.25 * photo + 0.25 * demand + fitmentBoost, 0, 1);
  const risk = clamp(0.45 * returnsRisk + 0.55 * shelfPenalty, 0, 0.65);

  const target = roundMoney(retail * quality * (1 - risk));
  const spread = clamp(0.22 - quality * 0.08 + risk * 0.1, 0.12, 0.3);

  const low = roundMoney(target * (1 - spread));
  const high = roundMoney(target * (1 + spread * 0.65));

  const score = Math.round(clamp((quality * (1 - risk) + demand * 0.25) * 100, 0, 100));
  const confidence = Math.round(clamp(0.45 + photo * 0.25 + (input.hasFitmentDetails ? 0.15 : 0), 0.2, 0.95) * 100) / 100;

  let recommendation: PartEvaluationResult["recommendation"] = "pass";
  if (score >= 72 && confidence >= 0.6) {
    recommendation = "buy";
  } else if (score >= 50) {
    recommendation = "negotiate";
  }

  const reasons: string[] = [
    `Condition ${input.conditionScore}/10`,
    `Demand ${(demand * 100).toFixed(0)}%`,
    input.hasFitmentDetails ? "Fitment details included" : "Missing fitment details",
    `Returns risk ${(returnsRisk * 100).toFixed(0)}%`,
  ];

  return {
    score,
    offerBand: { low, target, high },
    recommendation,
    confidence,
    reasons,
  };
}
