import type { MockDb } from "../data/mockDb";
import type { UserRole } from "../types";
import { isSensitiveOperationAllowed, redactSensitive } from "../security/sensitive";

type Session = {
  token: string;
  userId: string;
  role: UserRole;
  apiKey?: string;
};

function makeToken(userId: string): string {
  return `tok_${userId}_${Date.now()}`;
}

export function registerAuthRoutes(db: MockDb) {
  const sessions = new Map<string, Session>();

  return {
    login: (email: string) => {
      const user = db.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return { ok: false, error: "User not found" } as const;
      }

      const token = makeToken(user.id);
      const session: Session = {
        token,
        userId: user.id,
        role: user.role,
      };
      sessions.set(token, session);

      return {
        ok: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      } as const;
    },

    verify: (token: string) => {
      const session = sessions.get(token);
      if (!session) {
        return { ok: false, error: "Invalid token" } as const;
      }
      return { ok: true, session } as const;
    },

    logout: (token: string) => {
      sessions.delete(token);
      return { ok: true } as const;
    },

    issueServiceKey: (token: string) => {
      const session = sessions.get(token);
      if (!session) {
        return { ok: false, error: "Invalid token" } as const;
      }
      if (!isSensitiveOperationAllowed(session.role)) {
        return { ok: false, error: "Admin role required" } as const;
      }

      session.apiKey = `sk_test_${session.userId}_${Date.now()}`;
      sessions.set(token, session);
      return {
        ok: true,
        apiKey: redactSensitive(session.apiKey),
      } as const;
    },
  };
}
