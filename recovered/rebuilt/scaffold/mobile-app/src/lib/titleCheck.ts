import { extractVin } from "./vin";

export type TitleStatus = "clean" | "rebuilt" | "salvage" | "junk" | "flood" | "theft" | "unknown";

export type TitleCheckResult = {
  status: TitleStatus;
  confidence: number;
  note: string;
  source: "provider" | "vpic" | "local";
};

type ProviderPayload = {
  status?: string;
  confidence?: number;
  note?: string;
};

function normalizeStatus(raw: string | undefined): TitleStatus {
  const value = (raw ?? "").toLowerCase();
  if (value.includes("salvage")) return "salvage";
  if (value.includes("rebuilt")) return "rebuilt";
  if (value.includes("junk")) return "junk";
  if (value.includes("flood")) return "flood";
  if (value.includes("theft") || value.includes("stolen")) return "theft";
  if (value.includes("clean")) return "clean";
  return "unknown";
}

async function runProviderCheck(vin: string): Promise<TitleCheckResult | null> {
  const apiUrl = process.env.EXPO_PUBLIC_TITLE_CHECK_API_URL;
  if (!apiUrl) {
    return null;
  }

  const url = new URL(apiUrl);
  url.searchParams.set("vin", vin);

  const apiKey = process.env.EXPO_PUBLIC_TITLE_CHECK_API_KEY;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    throw new Error(`Provider request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ProviderPayload;
  return {
    status: normalizeStatus(payload.status),
    confidence: payload.confidence ?? 0.82,
    note: payload.note ?? "Title history response received from configured provider.",
    source: "provider",
  };
}

async function runVpicDecode(vin: string): Promise<TitleCheckResult> {
  const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`);
  if (!response.ok) {
    throw new Error(`vPIC decode failed with status ${response.status}`);
  }

  const json = (await response.json()) as {
    Results?: Array<{ ErrorCode?: string; ErrorText?: string; Make?: string; Model?: string; ModelYear?: string }>;
  };

  const row = json.Results?.[0];
  const descriptor = [row?.ModelYear, row?.Make, row?.Model].filter(Boolean).join(" ");

  if (row?.ErrorCode && row.ErrorCode !== "0") {
    return {
      status: "unknown",
      confidence: 0.35,
      note: row.ErrorText || "VIN decoded with warnings. Verify title through your configured provider.",
      source: "vpic",
    };
  }

  return {
    status: "unknown",
    confidence: 0.42,
    note: descriptor
      ? `VIN decoded as ${descriptor}. Configure EXPO_PUBLIC_TITLE_CHECK_API_URL for official title history.`
      : "VIN decoded. Configure EXPO_PUBLIC_TITLE_CHECK_API_URL for official title history.",
    source: "vpic",
  };
}

export async function checkVinTitle(vinInput: string): Promise<TitleCheckResult> {
  const vin = extractVin(vinInput);
  if (!vin) {
    return {
      status: "unknown",
      confidence: 0,
      note: "Invalid VIN format. Enter or scan a valid 17-character VIN.",
      source: "local",
    };
  }

  const providerResult = await runProviderCheck(vin);
  if (providerResult) {
    return providerResult;
  }

  return runVpicDecode(vin);
}
