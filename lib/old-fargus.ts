export function calculateFargus(metadata: any) {
  const weights = {
    F: 0.2,   // Features
    A: 0.15,  // Accessibility
    R: 0.15,  // Reliability
    G: 0.15,  // Growth
    O: 0.2,   // Optimization
    S: 0.15,  // Security
  };

  const score =
    (metadata.title ? 10 : 0) * weights.F +
    (metadata.description ? 10 : 0) * weights.A +
    (metadata.statusCode === 200 ? 10 : 0) * weights.R +
    (metadata.tech ? 10 : 0) * weights.G +
    (metadata.platform ? 10 : 0) * weights.O +
    (metadata.favicon ? 10 : 0) * weights.S;

  return Math.round(score * 10); // Convert to 0–100 scale
}
