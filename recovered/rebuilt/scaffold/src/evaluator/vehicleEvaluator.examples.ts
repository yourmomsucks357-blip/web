import { evaluateVehicle } from "./vehicleEvaluator";

const strongCandidate = evaluateVehicle({
  baseMarketValue: 18250,
  year: 2019,
  mileage: 64200,
  conditionScore: 8.2,
  accidentCount: 0,
  serviceHistoryRatio: 0.9,
  titleStatus: "clean",
  demandIndex: 0.74,
  locationFactor: 1.05,
  photoQualityScore: 0.8,
});

const weakCandidate = evaluateVehicle({
  baseMarketValue: 12400,
  year: 2011,
  mileage: 189000,
  conditionScore: 4.9,
  accidentCount: 3,
  serviceHistoryRatio: 0.35,
  titleStatus: "rebuilt",
  demandIndex: 0.42,
  locationFactor: 0.95,
  photoQualityScore: 0.45,
});

export const evaluatorExamples = {
  strongCandidate,
  weakCandidate,
};
