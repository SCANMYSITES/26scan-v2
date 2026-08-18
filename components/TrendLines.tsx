"use client";

import { useState } from "react";

export default function TrendLines({ trendLines }) {
  const [showTrends, setShowTrends] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowTrends(!showTrends)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {showTrends ? "Hide Trendlines" : "Show Trendlines"}
      </button>

      {showTrends && (
        <div className="mt-4 space-y-3">
          {trendLines.map((line, index) => (
            <div
              key={index}
              className="p-3 rounded bg-slate-700 border border-slate-600"
            >
              <p className="font-semibold">Trend #{index + 1}</p>
              <p>Slope: {line.slope}</p>
              <p>Intercept: {line.intercept}</p>
              <p>R²: {line.r2}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
