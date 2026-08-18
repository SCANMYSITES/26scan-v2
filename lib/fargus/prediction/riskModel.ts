import { FargusPredictionInput } from "./predictionTypes";

export function deriveRiskScore(input: FargusPredictionInput): number {
  const { signals } = input;

  // Combine weighted signals into a composite risk score
  const exposure = signals["exposure"] ?? 0;
  const malware = signals["malware"] ?? 0;
  const ssl = signals["ssl"] ?? 0;
  const dns = signals["dns"] ?? 0;
  const uptime = signals["uptime"] ?? 0;

  // Weighted formula for risk scoring
  const score =
    exposure * 0.35 +
    malware * 0.25 +
    ssl * 0.15 +
    dns * 0.15 +
    uptime * 0.10;

  // Clamp between 0–100
  return Math.min(Math.max(Math.round(score), 0), 100);
}

export function classifyRiskLevel(score: number): "low" | "medium" | "high" {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}
