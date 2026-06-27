import { detectSensitive, isSensitiveOperationAllowed, redactSensitive } from "../security/sensitive";

export function registerSecurityRoutes() {
  return {
    scanText: (text: string) => {
      const matches = detectSensitive(text);
      return {
        ok: true,
        matches,
        redacted: redactSensitive(text),
      } as const;
    },

    guardSensitiveAction: (role: "seller" | "buyer" | "admin") => {
      const allowed = isSensitiveOperationAllowed(role);
      return {
        ok: allowed,
        allowed,
        error: allowed ? undefined : "Sensitive operation requires admin role",
      } as const;
    },
  };
}
