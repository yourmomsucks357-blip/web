import type { Listing, Vehicle } from "../../types";
import { evaluateVehicle } from "../../evaluator";

export type SearchCard = {
  listingId: string;
  title: string;
  askPrice: number;
  recommendation: "buy" | "negotiate" | "pass";
  score: number;
  targetOffer: number;
};

export function buildSearchCards(listings: Listing[], vehicles: Vehicle[]): SearchCard[] {
  return listings
    .filter((listing) => listing.status === "active")
    .map((listing) => {
      const vehicle = vehicles.find((entry) => entry.id === listing.vehicleId);
      if (!vehicle) {
        return {
          listingId: listing.id,
          title: listing.title,
          askPrice: listing.askPrice,
          recommendation: "pass" as const,
          score: 0,
          targetOffer: 0,
        };
      }

      const evaluation = evaluateVehicle({
        baseMarketValue: vehicle.baseMarketValue,
        year: vehicle.year,
        mileage: vehicle.mileage,
        conditionScore: vehicle.conditionScore,
        accidentCount: vehicle.accidentCount,
        serviceHistoryRatio: vehicle.serviceHistoryRatio,
        titleStatus: vehicle.titleStatus,
        demandIndex: listing.demandIndex,
        locationFactor: vehicle.locationFactor,
        photoQualityScore: vehicle.photoQualityScore,
      });

      return {
        listingId: listing.id,
        title: listing.title,
        askPrice: listing.askPrice,
        recommendation: evaluation.recommendation,
        score: evaluation.score,
        targetOffer: evaluation.offerBand.target,
      };
    });
}

export function SearchScreen(listings: Listing[], vehicles: Vehicle[]) {
  return {
    cards: buildSearchCards(listings, vehicles),
  };
}
