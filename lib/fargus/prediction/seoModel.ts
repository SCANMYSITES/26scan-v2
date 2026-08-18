import { FargusPredictionInput } from "./predictionTypes";

export function deriveSeoMovement(input: FargusPredictionInput): number {
  const { signals } = input;

  // SEO signals
  const keywordScore = signals["keywordScore"] ?? 0;
  const headingScore = signals["headingScore"] ?? 0;
  const metadataScore = signals["metadataScore"] ?? 0;
  const contentDepth = signals["contentDepth"] ?? 0;

  // Weighted SEO movement formula
  const score =
    keywordScore * 0.4 +
    headingScore * 0.3 +
    metadataScore * 0.2 +
    contentDepth * 0.1;

  // Clamp between 0–100
  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function classifySeoLevel(score: number): "strong" | "average" | "weak" {
  if (score >= 70) return "strong";
  if (score >= 40) return "average";
  return "weak";
}
