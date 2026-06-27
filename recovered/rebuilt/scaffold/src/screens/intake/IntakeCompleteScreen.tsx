import type { VehicleEvaluationResult } from "../../evaluator";

export type IntakeSummary = {
  headline: string;
  recommendation: VehicleEvaluationResult["recommendation"];
  targetOffer: number;
  confidence: number;
  reasons: string[];
};

export function buildIntakeSummary(result: VehicleEvaluationResult): IntakeSummary {
  return {
    headline: "Intake complete",
    recommendation: result.recommendation,
    targetOffer: result.offerBand.target,
    confidence: result.confidence,
    reasons: result.reasons,
  };
}

export function IntakeCompleteScreen(result: VehicleEvaluationResult) {
  return buildIntakeSummary(result);
}
