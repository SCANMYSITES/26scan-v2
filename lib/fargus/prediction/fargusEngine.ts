import { FargusPredictionInput } from "./predictionTypes";
import { deriveRelevance } from "./relevanceModel";
import { deriveRiskScore, classifyRiskLevel } from "./riskModel";
import { deriveGeoFootprint, classifyGeoLevel } from "./geoModel";
import { deriveSeoMovement, classifySeoLevel } from "./seoModel";
import { deriveComplianceDrift, classifyComplianceLevel } from "./complianceModel";

export interface FargusEngineOutput {
  relevance: {
    level: string;
  };
  risk: {
    score: number;
    level: string;
  };
  geo: {
    score: number;
    level: string;
  };
  seo: {
    score: number;
    level: string;
  };
  compliance: {
    score: number;
    level: string;
  };
  finalScore: number;
}

export function runFargusEngine(
  input: FargusPredictionInput
): FargusEngineOutput {
  // MODULE 1 — Business Relevance
  const relevanceLevel = deriveRelevance(input);

  // MODULE 2 — Risk
  const riskScore = deriveRiskScore(input);
  const riskLevel = classifyRiskLevel(riskScore);

  // MODULE 3 — GEO
  const geoScore = deriveGeoFootprint(input);
  const geoLevel = classifyGeoLevel(geoScore);

  // MODULE 4 — SEO
  const seoScore = deriveSeoMovement(input);
  const seoLevel = classifySeoLevel(seoScore);

  // MODULE 5 — Compliance
  const complianceScore = deriveComplianceDrift(input);
  const complianceLevel = classifyComplianceLevel(complianceScore);

  // FINAL FARGUS SCORE (weighted composite)
  const finalScore = Math.round(
    relevanceLevel === "high" ? 20 :
    relevanceLevel === "medium" ? 10 : 5
  +
    riskScore * 0.25 +
    geoScore * 0.20 +
    seoScore * 0.20 +
    complianceScore * 0.15
  );

  return {
    relevance: { level: relevanceLevel },
    risk: { score: riskScore, level: riskLevel },
    geo: { score: geoScore, level: geoLevel },
    seo: { score: seoScore, level: seoLevel },
    compliance: { score: complianceScore, level: complianceLevel },
    finalScore
  };
}
