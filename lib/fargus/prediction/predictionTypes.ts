export interface FargusPredictionInput {
  businessScore: number;
  businessType: string | null;
  signals: Record<string, number>;
}

export type RelevanceLevel = "high" | "medium" | "low";
