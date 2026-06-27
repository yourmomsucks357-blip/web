export type SensitiveMatch = {
  kind: "api_key" | "token" | "secret" | "private_key" | "password";
  value: string;
};

const PATTERNS: Array<{ kind: SensitiveMatch["kind"]; regex: RegExp }> = [
  {
    kind: "private_key",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
  { kind: "api_key", regex: /\b(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]{10,}\b/g },
  { kind: "token", regex: /\b(?:ghp|gho|ghu|github_pat)_[A-Za-z0-9_]{20,}\b/g },
  {
    kind: "secret",
    regex: /\b(?:secret|access|auth)[_-]?(?:key|token)\s*[:=]\s*['\"]?[A-Za-z0-9_\-]{10,}['\"]?/gi,
  },
  { kind: "password", regex: /\bpassword\s*[:=]\s*['\"]?[^'\"\s]{6,}['\"]?/gi },
];

export function detectSensitive(text: string): SensitiveMatch[] {
  const matches: SensitiveMatch[] = [];
  for (const pattern of PATTERNS) {
    for (const match of text.matchAll(pattern.regex)) {
      matches.push({
        kind: pattern.kind,
        value: match[0],
      });
    }
  }
  return matches;
}

export function redactSensitive(text: string): string {
  let output = text;
  for (const pattern of PATTERNS) {
    output = output.replace(pattern.regex, `[REDACTED_${pattern.kind.toUpperCase()}]`);
  }
  return output;
}

export function isSensitiveOperationAllowed(role: "seller" | "buyer" | "admin"): boolean {
  return role === "admin";
}
