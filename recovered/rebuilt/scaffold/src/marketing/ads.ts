import type { MarketingEvent } from "../types";

export type PixelPayload = {
  event_name: string;
  event_time: string;
  event_source_url?: string;
  user_data?: {
    external_id?: string;
  };
  custom_data?: {
    value?: number;
    currency?: string;
    listing_id?: string;
  };
};

export function toMetaPixelPayload(event: MarketingEvent): PixelPayload {
  return {
    event_name: event.type,
    event_time: event.at,
    event_source_url: event.campaign,
    user_data: {
      external_id: event.userId,
    },
    custom_data: {
      value: event.value,
      currency: "USD",
      listing_id: event.listingId,
    },
  };
}

export type GoogleAdsConversion = {
  conversionAction: string;
  conversionTime: string;
  conversionValue: number;
  currencyCode: string;
  orderId?: string;
};

export function toGoogleAdsConversion(event: MarketingEvent): GoogleAdsConversion {
  return {
    conversionAction: event.type,
    conversionTime: event.at,
    conversionValue: event.value ?? 0,
    currencyCode: "USD",
    orderId: event.id,
  };
}
