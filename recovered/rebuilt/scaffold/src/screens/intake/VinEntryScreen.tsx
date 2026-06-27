export type VinDecodeResult = {
  vin: string;
  valid: boolean;
  yearHint?: number;
  checksumHint: "weak" | "good";
};

export function decodeVin(vinInput: string): VinDecodeResult {
  const vin = vinInput.trim().toUpperCase();
  const validChars = /^[A-HJ-NPR-Z0-9]{17}$/;
  const valid = validChars.test(vin);

  const yearMap: Record<string, number> = {
    A: 2010,
    B: 2011,
    C: 2012,
    D: 2013,
    E: 2014,
    F: 2015,
    G: 2016,
    H: 2017,
    J: 2018,
    K: 2019,
    L: 2020,
    M: 2021,
    N: 2022,
    P: 2023,
    R: 2024,
    S: 2025,
    T: 2026,
  };

  const yearCode = valid ? vin[9] : "";
  const yearHint = yearMap[yearCode];

  return {
    vin,
    valid,
    yearHint,
    checksumHint: valid ? "good" : "weak",
  };
}

export function VinEntryScreen(vinInput: string) {
  return decodeVin(vinInput);
}
