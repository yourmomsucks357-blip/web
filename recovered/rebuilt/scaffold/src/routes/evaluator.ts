import type { MockDb } from "../data/mockDb";
import { evaluateVehicle } from "../evaluator";

export function registerEvaluatorRoutes(db: MockDb) {
  return {
    evaluateByVehicleId: (vehicleId: string, demandIndex = 0.5) => {
      const vehicle = db.vehicles.find((item) => item.id === vehicleId);
      if (!vehicle) {
        return {
          ok: false,
          error: "Vehicle not found",
        } as const;
      }

      return {
        ok: true,
        result: evaluateVehicle({
          baseMarketValue: vehicle.baseMarketValue,
          year: vehicle.year,
          mileage: vehicle.mileage,
          conditionScore: vehicle.conditionScore,
          accidentCount: vehicle.accidentCount,
          serviceHistoryRatio: vehicle.serviceHistoryRatio,
          titleStatus: vehicle.titleStatus,
          demandIndex,
          locationFactor: vehicle.locationFactor,
          photoQualityScore: vehicle.photoQualityScore,
        }),
      } as const;
    },
  };
}
