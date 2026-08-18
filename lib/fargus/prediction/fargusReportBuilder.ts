import { runFargusEngine } from "./fargusEngine";
import { FargusPredictionInput } from "./predictionTypes";

export function buildFargusReport(input: FargusPredictionInput) {
  const result = runFargusEngine(input);

  return {
    fargusScore: result.finalScore,
    relevance: {
      level: result.relevance.level
    },
    risk: {
      score: result.risk.score,
      level: result.risk.level
    },
    geo: {
      score: result.geo.score,
      level: result.geo.level
    },
    seo: {
      score: result.seo.score,
      level: result.seo.level
    },
    compliance: {
      score: result.compliance.score,
      level: result.compliance.level
    }
  };
}
