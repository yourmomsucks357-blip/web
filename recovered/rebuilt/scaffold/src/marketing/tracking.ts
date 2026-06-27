import { createId } from "../data/mockDb";
import type { MarketingEvent } from "../types";

export type UTMParams = {
  source?: string;
  medium?: string;
  campaign?: string;
};

export function parseUtmFromUrl(url: string): UTMParams {
  try {
    const parsed = new URL(url);
    return {
      source: parsed.searchParams.get("utm_source") ?? undefined,
      medium: parsed.searchParams.get("utm_medium") ?? undefined,
      campaign: parsed.searchParams.get("utm_campaign") ?? undefined,
    };
  } catch {
    return {};
  }
}

export function trackEvent(events: MarketingEvent[], input: Omit<MarketingEvent, "id" | "at">): MarketingEvent {
  const next: MarketingEvent = {
    id: createId("mkt"),
    at: new Date().toISOString(),
    ...input,
  };
  events.push(next);
  return next;
}

export function campaignDemandIndex(events: MarketingEvent[], listingId: string): number {
  const listingEvents = events.filter((event) => event.listingId === listingId);
  const views = listingEvents.filter((event) => event.type === "page_view").length;
  const leads = listingEvents.filter((event) => event.type === "lead").length;
  const offerSubmits = listingEvents.filter((event) => event.type === "offer_submitted").length;

  if (views === 0 && leads === 0 && offerSubmits === 0) {
    return 0.5;
  }

  const score = 0.2 + Math.min(1, views / 100) * 0.3 + Math.min(1, leads / 30) * 0.25 + Math.min(1, offerSubmits / 20) * 0.25;
  return Math.round(Math.min(1, score) * 100) / 100;
}
