// C:\A_DEVJUL\26scan-v2\app\api\fargus\engine\engine.ts

import type { FargusParams, FargusResult } from "./fargus.types";

export function normalizeInput(raw: any): FargusParams {
  return {
    query: typeof raw.query === "string" ? raw.query.trim() : "",
    mode: raw.mode ?? "standard",
    userId: raw.userId ?? "unknown",
    flags: {
      verbose: Boolean(raw.flags?.verbose),
      diagnostics: Boolean(raw.flags?.diagnostics),
    },
    timestamp: Date.now(),
  };
}

async function executeFargusJob(params: FargusParams): Promise<any> {
  const { query, mode, flags } = params;

  // 1️⃣ Basic signal extraction
  const lengthScore = Math.min(query.length / 10, 10); // 0–10
  const keywordScore = ["risk", "fraud", "growth", "decline"].some(k =>
    query.toLowerCase().includes(k)
  )
    ? 8
    : 2;

  // 2️⃣ Risk detection
  const riskSignals = [];
  if (query.toLowerCase().includes("fraud")) riskSignals.push("Fraud indicator detected");
  if (query.toLowerCase().includes("decline")) riskSignals.push("Business decline pattern");
  if (query.toLowerCase().includes("risk")) riskSignals.push("General risk keyword present");

  const riskLevel =
    riskSignals.length === 0
      ? "Low"
      : riskSignals.length === 1
      ? "Medium"
      : "High";

  // 3️⃣ Business intelligence summary
  const summary = (() => {
    if (riskLevel === "High") return "High‑risk indicators detected. Immediate review recommended.";
    if (riskLevel === "Medium") return "Moderate risk signals present. Monitor closely.";
    return "No significant risk detected. Business appears stable.";
  })();

  // 4️⃣ Diagnostics mode
  const diagnosticsBlock = flags.diagnostics
    ? {
        diagnosticsEnabled: true,
        rawQueryLength: query.length,
        computedLengthScore: lengthScore,
        computedKeywordScore: keywordScore,
        riskSignals,
        modeUsed: mode,
        processedAt: new Date().toISOString()
      }
    : null;

  // 5️⃣ Final structured intelligence output
  return {
    input: query,
    modeUsed: mode,
    riskLevel,
    riskSignals,
    scores: {
      lengthScore,
      keywordScore,
      combinedScore: Math.round((lengthScore + keywordScore) / 2)
    },
    summary,
    diagnostics: diagnosticsBlock
  };
}


function formatError(err: any) {
  return {
    message: err?.message ?? "Unknown error",
    stack: err?.stack ?? null,
    type: err?.name ?? "Error"
  };
}

function normalizeOutput(payload: {
  ok: boolean;
  data?: any;
  error?: any;
  timestamp: number;
  meta?: any;
}): FargusResult {
  return {
    ok: payload.ok,
    data: payload.data ?? null,
    error: payload.error ?? null,
    timestamp: payload.timestamp,
    meta: payload.meta ?? { engine: "FARGUS v1" }
  };
}

export async function runFargusEngine(params: FargusParams): Promise<FargusResult> {
  const normalized = normalizeInput(params);

  try {
    const result = await executeFargusJob(normalized);

    return normalizeOutput({
      ok: true,
      data: result,
      timestamp: Date.now(),
      meta: { engine: "FARGUS v1" }
    });

  } catch (err: any) {
    return normalizeOutput({
      ok: false,
      error: formatError(err),
      timestamp: Date.now(),
      meta: { engine: "FARGUS v1" }
    });
  }
}
