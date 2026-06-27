import type { MockDb } from "../data/mockDb";
import { campaignDemandIndex, parseUtmFromUrl, trackEvent } from "../marketing/tracking";
import { toGoogleAdsConversion, toMetaPixelPayload } from "../marketing/ads";
import { redactSensitive } from "../security/sensitive";

export function registerMarketingRoutes(db: MockDb) {
  return {
    capturePageView: (params: { url: string; listingId?: string; userId?: string }) => {
      const utm = parseUtmFromUrl(params.url);
      return trackEvent(db.marketingEvents, {
        type: "page_view",
        source: utm.source,
        medium: utm.medium,
        campaign: utm.campaign,
        listingId: params.listingId,
        userId: params.userId,
      });
    },

    captureLead: (params: { listingId: string; userId?: string; value?: number; source?: string }) => {
      return trackEvent(db.marketingEvents, {
        type: "lead",
        source: params.source,
        listingId: params.listingId,
        userId: params.userId,
        value: params.value,
      });
    },

    getCampaignDemand: (listingId: string) => {
      return campaignDemandIndex(db.marketingEvents, listingId);
    },

    exportConversions: () => {
      const conversionEvents = db.marketingEvents.filter((event) => event.type !== "page_view");
      return {
        meta: conversionEvents.map(toMetaPixelPayload),
        google: conversionEvents.map(toGoogleAdsConversion),
      };
    },

    exportConversionsRedacted: () => {
      const conversionEvents = db.marketingEvents.filter((event) => event.type !== "page_view");
      return conversionEvents.map((event) => redactSensitive(JSON.stringify(event)));
    },
  };
}
