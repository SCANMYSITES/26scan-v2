import { FargusPredictionInput } from "./predictionTypes";

export function deriveComplianceDrift(input: FargusPredictionInput): number {
  const { signals } = input;

  // Compliance signals
  const privacyScore = signals["privacyScore"] ?? 0;
  const policyScore = signals["policyScore"] ?? 0;
  const cookieScore = signals["cookieScore"] ?? 0;
  const regulatoryScore = signals["regulatoryScore"] ?? 0;

  // Weighted compliance drift formula
  const score =
    privacyScore * 0.4 +
    policyScore * 0.3 +
    cookieScore * 0.2 +
    regulatoryScore * 0.1;

  // Clamp between 0–100
  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function classifyComplianceLevel(score: number): "stable" | "drifting" | "critical" {
  if (score >= 70) return "stable";
  if (score >= 40) return "drifting";
  return "critical";
}
