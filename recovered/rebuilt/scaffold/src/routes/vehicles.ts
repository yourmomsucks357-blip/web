import type { MockDb } from "../data/mockDb";
import { createId } from "../data/mockDb";
import { evaluateVehicle } from "../evaluator";
import type { Vehicle } from "../types";

type CreateVehicleInput = Omit<Vehicle, "id">;

export function registerVehicleRoutes(db: MockDb) {
  return {
    listByOwner: (ownerId: string) => {
      return db.vehicles.filter((vehicle) => vehicle.ownerId === ownerId);
    },

    getById: (vehicleId: string) => {
      return db.vehicles.find((vehicle) => vehicle.id === vehicleId) ?? null;
    },

    create: (input: CreateVehicleInput) => {
      const next: Vehicle = {
        ...input,
        id: createId("veh"),
      };
      db.vehicles.push(next);
      return next;
    },

    evaluate: (vehicleId: string, demandIndex = 0.5) => {
      const vehicle = db.vehicles.find((item) => item.id === vehicleId);
      if (!vehicle) {
        return {
          ok: false,
          error: "Vehicle not found",
        } as const;
      }

      const result = evaluateVehicle({
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
      });

      return {
        ok: true,
        result,
      } as const;
    },
  };
}
