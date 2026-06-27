import { createMockDb } from "./data/mockDb";
import { runVehicleEvaluatorSpec } from "./evaluator/vehicleEvaluator.spec";
import { registerAuthRoutes } from "./routes/auth";
import { registerEvaluatorRoutes } from "./routes/evaluator";
import { registerListingRoutes } from "./routes/listings";
import { registerMarketingRoutes } from "./routes/marketing";
import { registerSecurityRoutes } from "./routes/security";
import { registerVehicleRoutes } from "./routes/vehicles";

export function buildApp() {
  const db = createMockDb();

  const auth = registerAuthRoutes(db);
  const vehicles = registerVehicleRoutes(db);
  const listings = registerListingRoutes(db);
  const marketing = registerMarketingRoutes(db);
  const evaluator = registerEvaluatorRoutes(db);
  const security = registerSecurityRoutes();

  return {
    db,
    auth,
    vehicles,
    listings,
    marketing,
    evaluator,
    security,
    selfCheck: {
      evaluator: runVehicleEvaluatorSpec,
      sensitiveScan: () => security.scanText("password=SuperSecret123 sk_test_ABCDEF123456"),
    },
  };
}
