export type UserRole = "seller" | "buyer" | "admin";

export type User = {
  id: string;
  email: string;
  role: UserRole;
};

export type VehicleTitle = "clean" | "rebuilt" | "salvage" | "lemon";

export type Vehicle = {
  id: string;
  ownerId: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  conditionScore: number;
  accidentCount: number;
  serviceHistoryRatio: number;
  titleStatus: VehicleTitle;
  baseMarketValue: number;
  locationFactor?: number;
  photoQualityScore?: number;
};

export type ListingStatus = "draft" | "active" | "sold";

export type Listing = {
  id: string;
  vehicleId: string;
  sellerId: string;
  title: string;
  description: string;
  askPrice: number;
  demandIndex: number;
  status: ListingStatus;
  createdAt: string;
};

export type MarketingEvent = {
  id: string;
  type: "page_view" | "lead" | "offer_submitted" | "listing_created";
  source?: string;
  medium?: string;
  campaign?: string;
  listingId?: string;
  vehicleId?: string;
  userId?: string;
  value?: number;
  at: string;
};
