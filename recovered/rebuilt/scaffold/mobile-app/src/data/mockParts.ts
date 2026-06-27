import type { PartCondition } from "../lib/partsEvaluator";

export type PartListing = {
  id: string;
  title: string;
  estimatedRetailPrice: number;
  conditionScore: PartCondition;
  demandIndex: number;
  daysOnShelf: number;
  hasFitmentDetails: boolean;
  photoQualityScore: number;
  returnsRisk: number;
};

export const mockParts: PartListing[] = [
  {
    id: "prt-001",
    title: "OEM Headlight Assembly - Honda Accord 2018",
    estimatedRetailPrice: 280,
    conditionScore: 8,
    demandIndex: 0.74,
    daysOnShelf: 22,
    hasFitmentDetails: true,
    photoQualityScore: 0.82,
    returnsRisk: 0.12,
  },
  {
    id: "prt-002",
    title: "Front Bumper Cover - Toyota Camry 2016",
    estimatedRetailPrice: 190,
    conditionScore: 6,
    demandIndex: 0.57,
    daysOnShelf: 74,
    hasFitmentDetails: false,
    photoQualityScore: 0.66,
    returnsRisk: 0.28,
  },
  {
    id: "prt-003",
    title: "Alternator - Ford F-150 3.5L EcoBoost",
    estimatedRetailPrice: 320,
    conditionScore: 9,
    demandIndex: 0.8,
    daysOnShelf: 10,
    hasFitmentDetails: true,
    photoQualityScore: 0.9,
    returnsRisk: 0.1,
  },
];
