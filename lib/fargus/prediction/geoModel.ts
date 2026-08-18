import { FargusPredictionInput } from "./predictionTypes";

export function deriveGeoFootprint(input: FargusPredictionInput): number {
  const { signals } = input;

  // GEO signals
  const countryMatch = signals["countryMatch"] ?? 0;
  const regionMatch = signals["regionMatch"] ?? 0;
  const localPresence = signals["localPresence"] ?? 0;

  // Weighted GEO footprint formula
  const score =
    countryMatch * 0.5 +
    regionMatch * 0.3 +
    localPresence * 0.2;

  // Clamp between 0–100
  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function classifyGeoLevel(score: number): "local" | "regional" | "national" {
  if (score >= 70) return "national";
  if (score >= 40) return "regional";
  return "local";
}
