"use client";

import React from "react";

export default function FargusPanel({ report }) {
  return (
    <div className="p-6 bg-slate-900 text-gray-100 rounded-lg border border-slate-700 shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-blue-400">
        FARGUS Intelligence Panel
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-slate-800 p-5 rounded border border-slate-700">
          <h3 className="font-semibold text-gray-300 mb-1">Final Score</h3>
          <p className="text-4xl font-bold text-blue-300">{report.fargusScore}</p>
        </div>

        <div className="bg-slate-800 p-5 rounded border border-slate-700">
          <h3 className="font-semibold text-gray-300 mb-1">Business Relevance</h3>
          <p className="text-lg">{report.relevance.level}</p>
        </div>

        <div className="bg-slate-800 p-5 rounded border border-slate-700">
          <h3 className="font-semibold text-gray-300 mb-1">Risk</h3>
          <p>Score: <span className="text-red-300">{report.risk.score}</span></p>
          <p>Level: <span className="text-red-400">{report.risk.level}</span></p>
        </div>

        <div className="bg-slate-800 p-5 rounded border border-slate-700">
          <h3 className="font-semibold text-gray-300 mb-1">GEO Footprint</h3>
          <p>Score: <span className="text-yellow-300">{report.geo.score}</span></p>
          <p>Level: <span className="text-yellow-400">{report.geo.level}</span></p>
        </div>

        <div className="bg-slate-800 p-5 rounded border border-slate-700">
          <h3 className="font-semibold text-gray-300 mb-1">SEO Movement</h3>
          <p>Score: <span className="text-green-300">{report.seo.score}</span></p>
          <p>Level: <span className="text-green-400">{report.seo.level}</span></p>
        </div>

        <div className="bg-slate-800 p-5 rounded border border-slate-700">
          <h3 className="font-semibold text-gray-300 mb-1">Compliance Drift</h3>
          <p>Score: <span className="text-purple-300">{report.compliance.score}</span></p>
          <p>Level: <span className="text-purple-400">{report.compliance.level}</span></p>
        </div>

      </div>
    </div>
  );
}
