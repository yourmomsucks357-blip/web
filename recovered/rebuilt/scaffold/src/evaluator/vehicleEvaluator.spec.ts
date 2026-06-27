import { evaluateVehicle } from "./vehicleEvaluator";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Evaluator test failed: ${message}`);
  }
}

export function runVehicleEvaluatorSpec(): string {
  const high = evaluateVehicle({
    baseMarketValue: 26000,
    year: 2021,
    mileage: 32000,
    conditionScore: 9.1,
    accidentCount: 0,
    serviceHistoryRatio: 0.95,
    titleStatus: "clean",
    demandIndex: 0.8,
    photoQualityScore: 0.9,
    locationFactor: 1.08,
  });

  const low = evaluateVehicle({
    baseMarketValue: 9000,
    year: 2009,
    mileage: 212000,
    conditionScore: 4.1,
    accidentCount: 2,
    serviceHistoryRatio: 0.3,
    titleStatus: "salvage",
    demandIndex: 0.35,
    photoQualityScore: 0.4,
    locationFactor: 0.93,
  });

  assert(high.score > low.score, "high quality vehicle should score better than low quality vehicle");
  assert(high.adjustedValue > low.adjustedValue, "high quality vehicle should be valued higher");
  assert(high.offerBand.target >= high.offerBand.low, "offer target must be >= offer low");
  assert(high.offerBand.high >= high.offerBand.target, "offer high must be >= target");

  return "vehicleEvaluator.spec passed";
}
