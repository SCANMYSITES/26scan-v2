// lib/seo/seoScore.ts

export function computeSeoScore(data: {
  title: string | null;
  description: string | null;
  h1: string | null;
  h2: string[];
  speedScore: number;
  mobileScore: number;
  brokenLinks: number;
}): number {
  let score = 0;

  // Title length (10–60 chars is ideal)
  if (data.title && data.title.length >= 10 && data.title.length <= 60) {
    score += 20;
  }

  // Description length (50–160 chars is ideal)
  if (data.description && data.description.length >= 50 && data.description.length <= 160) {
    score += 20;
  }

  // Header structure
  if (data.h1) score += 10;
  if (data.h2.length > 0) score += 10;

  // Speed and mobile friendliness
  score += Math.min(data.speedScore / 2, 20);
  score += Math.min(data.mobileScore / 2, 20);

  // Broken links
  if (data.brokenLinks === 0) score += 10;

  // Cap at 100
  return Math.min(score, 100);
}
