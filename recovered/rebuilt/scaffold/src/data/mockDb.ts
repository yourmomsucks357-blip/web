import type { Listing, MarketingEvent, User, Vehicle } from "../types";

export type MockDb = {
  users: User[];
  vehicles: Vehicle[];
  listings: Listing[];
  marketingEvents: MarketingEvent[];
};

let counter = 0;

export function createId(prefix: string): string {
  counter += 1;
  return `${prefix}_${counter.toString().padStart(4, "0")}`;
}

export function createMockDb(): MockDb {
  const users: User[] = [
    { id: "u_seller_1", email: "seller@example.com", role: "seller" },
    { id: "u_buyer_1", email: "buyer@example.com", role: "buyer" },
    { id: "u_admin_1", email: "admin@example.com", role: "admin" },
  ];

  const vehicles: Vehicle[] = [
    {
      id: "veh_001",
      ownerId: "u_seller_1",
      vin: "1FTFW1E5XJFC00001",
      make: "Ford",
      model: "F-150",
      year: 2018,
      mileage: 98000,
      conditionScore: 7.4,
      accidentCount: 1,
      serviceHistoryRatio: 0.75,
      titleStatus: "clean",
      baseMarketValue: 21000,
      locationFactor: 1.03,
      photoQualityScore: 0.76,
    },
  ];

  const listings: Listing[] = [
    {
      id: "lst_001",
      vehicleId: "veh_001",
      sellerId: "u_seller_1",
      title: "2018 Ford F-150 XLT",
      description: "Well maintained truck with recent service and clean interior.",
      askPrice: 19800,
      demandIndex: 0.66,
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ];

  return {
    users,
    vehicles,
    listings,
    marketingEvents: [],
  };
}
