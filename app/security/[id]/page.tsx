"use client";

import { useState, useEffect } from "react";

export default function SecurityPage({ params }: { params: { id: string } }) {
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/websites/${params.id}`);
      const data = await res.json();
      setSite(data);
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!site) return <div className="p-6">Website not found.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Security Assessment</h1>
      <p className="text-gray-600">{site.url}</p>

      <ToggleSecurity
        current={site.security}
        previous={site.previousSecurity}
      />
    </div>
  );
}

function ToggleSecurity({ current, previous }: any) {
  const [view, setView] = useState<"current" | "previous">("current");
  const data = view === "current" ? current : previous;

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setView("current")}
          className={`px-4 py-2 rounded ${
            view === "current" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Current Scan
        </button>

        <button
          onClick={() => setView("previous")}
          className={`px-4 py-2 rounded ${
            view === "previous" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Previous Scan
        </button>
      </div>

      <SecuritySummary data={data} view={view} />
    </div>
  );
}

function SecuritySummary({ data, view }: any) {
  if (!data) return <div>No data available.</div>;

  return (
    <div className="space-y-4 border p-4 rounded-lg bg-white shadow">
      <h2 className="text-xl font-bold">
        {view === "current" ? "Current Security Scan" : "Previous Security Scan"}
      </h2>

      <Item label="SSL Valid" value={data.sslValid ? "Yes" : "No"} />
      <Item label="Days to SSL Expiry" value={data.sslDaysToExpiry ?? "Unknown"} />
      <Item label="Mixed Content" value={data.mixedContent ? "Yes" : "No"} />
      <Item label="Admin Panel Exposed" value={data.exposedAdmin ? "Yes" : "No"} />
      <Item label="Sensitive Files Exposed" value={data.exposedFiles ? "Yes" : "No"} />

      <h3 className="font-semibold mt-4">Security Headers</h3>
      <Item label="CSP" value={data.securityHeaders?.csp ? "✔" : "✖"} />
      <Item label="HSTS" value={data.securityHeaders?.hsts ? "✔" : "✖"} />
      <Item label="X-Frame-Options" value={data.securityHeaders?.xFrame ? "✔" : "✖"} />
      <Item label="X-XSS-Protection" value={data.securityHeaders?.xXss ? "✔" : "✖"} />
      <Item label="X-Content-Type-Options" value={data.securityHeaders?.xContentType ? "✔" : "✖"} />

      <Item label="Outdated Libraries" value={data.outdatedLibs ? "Yes" : "No"} />
      <Item label="Vulnerable CMS" value={data.vulnerableCMS ? "Yes" : "No"} />

      <h3 className="font-semibold mt-4">Global Threat Intelligence</h3>
      <Item label="CVE Vulnerabilities" value={data.globalCveCount ?? "Unknown"} />
      <Item label="Malware Signatures" value={data.malwareDetected ? "Yes" : "No"} />
      <Item label="Botnet Activity" value={data.botnetActivity ?? "Unknown"} />
      <Item label="Heatmap Risk Level" value={data.heatmapRisk ?? "Unknown"} />

      <h3 className="font-semibold mt-4 text-red-600">Developer Required</h3>
      <p className="text-gray-700">
        Some issues require a website developer or hosting provider to fix. FARGUS cannot modify your
        website — we detect and report risks so you can take action.
      </p>
    </div>
  );
}

function Item({ label, value }: any) {
  return (
    <div className="flex justify-between border-b py-1">
      <span className="font-medium">{label}</span>
      <span>{value}</span>
    </div>
  );
}
