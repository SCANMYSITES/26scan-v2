import { FargusPredictionInput, RelevanceLevel } from "./predictionTypes";

export function deriveRelevance(
  input: FargusPredictionInput
): RelevanceLevel {
  const score = input.businessScore;

  if (score >= 70) {
    return "high";
  }

  if (score >= 40) {
    return "medium";
  }

  return "low";
}
