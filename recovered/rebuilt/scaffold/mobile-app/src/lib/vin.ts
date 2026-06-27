export function extractVin(raw: string): string | null {
  const cleaned = raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .replace(/[IOQ]/g, "");

  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(cleaned)) {
    return null;
  }

  return cleaned;
}
