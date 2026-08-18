// lib/geo/geoScore.ts

export function computeGeoScore(data: {
  riskScore: number;
  provider: string | null;
  country: string | null;
}) {
  let score = 100;

  // Higher risk reduces score
  score -= data.riskScore;

  // Missing provider reduces score
  if (!data.provider) score -= 10;

  // Missing country reduces score
  if (!data.country) score -= 10;

  // Never go below zero
  return Math.max(score, 0);
}
