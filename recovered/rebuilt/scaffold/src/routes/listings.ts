import type { MockDb } from "../data/mockDb";
import { createId } from "../data/mockDb";
import { evaluateVehicle } from "../evaluator";
import { campaignDemandIndex, trackEvent } from "../marketing/tracking";
import type { Listing } from "../types";

type CreateListingInput = Omit<Listing, "id" | "createdAt" | "status">;

export function registerListingRoutes(db: MockDb) {
  return {
    listActive: () => {
      return db.listings.filter((listing) => listing.status === "active");
    },

    getById: (listingId: string) => {
      const listing = db.listings.find((entry) => entry.id === listingId);
      if (!listing) {
        return null;
      }

      const vehicle = db.vehicles.find((entry) => entry.id === listing.vehicleId);
      const demandIndex = campaignDemandIndex(db.marketingEvents, listing.id);

      const valuation = vehicle
        ? evaluateVehicle({
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
          })
        : null;

      return {
        ...listing,
        demandIndex,
        valuation,
      };
    },

    create: (input: CreateListingInput) => {
      const listing: Listing = {
        id: createId("lst"),
        createdAt: new Date().toISOString(),
        status: "active",
        ...input,
      };
      db.listings.push(listing);

      trackEvent(db.marketingEvents, {
        type: "listing_created",
        userId: listing.sellerId,
        listingId: listing.id,
        vehicleId: listing.vehicleId,
      });

      return listing;
    },

    submitOfferSignal: (listingId: string, value: number, userId?: string) => {
      trackEvent(db.marketingEvents, {
        type: "offer_submitted",
        listingId,
        userId,
        value,
      });

      return {
        ok: true,
        demandIndex: campaignDemandIndex(db.marketingEvents, listingId),
      } as const;
    },
  };
}
