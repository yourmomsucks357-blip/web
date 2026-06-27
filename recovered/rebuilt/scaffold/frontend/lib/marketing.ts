export type MarketingEventName = "page_view" | "lead" | "offer_submitted" | "listing_created";

export type MarketingEventPayload = {
  event: MarketingEventName;
  value?: number;
  listingId?: string;
  source?: string;
  medium?: string;
  campaign?: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    fbq?: (eventType: string, eventName: string, payload?: Record<string, unknown>) => void;
    gtag?: (command: string, eventName: string, payload?: Record<string, unknown>) => void;
  }
}

export function readUtm(): { source?: string; medium?: string; campaign?: string } {
  if (typeof window === "undefined") {
    return {};
  }

  const url = new URL(window.location.href);
  return {
    source: url.searchParams.get("utm_source") ?? undefined,
    medium: url.searchParams.get("utm_medium") ?? undefined,
    campaign: url.searchParams.get("utm_campaign") ?? undefined,
  };
}

export function trackWebEvent(payload: MarketingEventPayload): void {
  if (typeof window === "undefined") {
    return;
  }

  const utm = readUtm();
  const data = {
    ...utm,
    ...payload,
    timestamp: new Date().toISOString(),
  };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(data);

  if (window.fbq) {
    window.fbq("trackCustom", payload.event, {
      value: payload.value,
      listing_id: payload.listingId,
      source: data.source,
      medium: data.medium,
      campaign: data.campaign,
    });
  }

  if (window.gtag) {
    window.gtag("event", payload.event, {
      value: payload.value,
      listing_id: payload.listingId,
      source: data.source,
      medium: data.medium,
      campaign: data.campaign,
    });
  }
}
