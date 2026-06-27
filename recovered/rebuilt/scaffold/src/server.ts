import { buildApp } from "./app";

export function startServer() {
  const app = buildApp();
  const initialListing = app.listings.listActive()[0];
  if (initialListing) {
    app.marketing.capturePageView({
      url: "https://example.com/listing?utm_source=google&utm_medium=cpc&utm_campaign=seller_launch",
      listingId: initialListing.id,
    });
  }

  return {
    status: "ready",
    evaluatorCheck: app.selfCheck.evaluator(),
    sensitiveScanCheck: app.selfCheck.sensitiveScan(),
    listingCount: app.listings.listActive().length,
    conversionExports: app.marketing.exportConversions(),
    conversionExportsRedacted: app.marketing.exportConversionsRedacted(),
    sensitiveGuard: app.security.guardSensitiveAction("admin"),
  };
}

startServer();
