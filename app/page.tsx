"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* Reusable Components */
function FeatureCard({ title }: { title: string }) {
  return (
    <div className="p-6 bg-white shadow rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
    </div>
  );
}

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">

      {/* HERO SECTION */}
      {/* HERO SECTION */}
     <section className="relative flex flex-col items-center text-center py-6 px-6 bg-gradient-to-b from-white to-blue-50">

        {/* TOP‑LEFT LOGO */}
        <div className="absolute top-6 left-6">
          <Image
            src="/26ScanLogo.png"
            alt="26Scan Logo"
            width={140}
            height={140}
            priority
          />
        </div>

        <h1 className="text-4xl font-extrabold text-blue-800 mb-4">
          WELCOME TO 26SCAN
        </h1>

        <p className="text-xl text-gray-700 mb-2">
          LEADING THE INDUSTRY IN WEBSITE ANALYSIS AND SECURITY
        </p>

        <p className="text-lg text-blue-700 font-semibold">
          ZERO TRUST FOR FORWARD FACING WEBSITES
        </p>

        {/* FARGUS TAGLINE */}
        <p className="text-sm text-blue-700 mt-3 italic">
          Introducing <strong>FARGUS™</strong> — the AI Website Watchman.
        </p>

        <p className="text-md text-gray-700 mt-4 max-w-2xl">
          Our security scan protects your website from malware, viruses, hackers,
          intrusion attempts, data theft, and identifies weaknesses before they
          become threats. We also score SEO, keyword performance, and overall
          security posture.
        </p>

        {/* Instruction */}
        <p className="text-md text-gray-700 mt-6 max-w-2xl">
          All users start here. Press <strong>Log On</strong> to begin.
        </p>

        {/* Single Log On button */}
        <button
          onClick={() => router.push("/new-account-sms")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition mt-4"
        >
          Log On
        </button>
      </section>

      {/* PRODUCT OVERVIEW SECTION */}
      <section className="max-w-6xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-blue-300 mb-10">
          26SCAN & FARGUS — COMPLETE WEBSITE INTELLIGENCE
        </h2>

        <p className="text-gray-200 max-w-4xl mx-auto mb-10 text-lg">
          26Scan is a SaaS platform designed to evaluate, monitor, score, and predict
          the health and performance of your website. FARGUS is our world‑class
          intelligence engine that continuously monitors your site for malware,
          intrusion attempts, data theft, and emerging threats — AI‑powered
          predictive analysis and real‑time alerts.
          <br /><br />
          CREATE AN ACCOUNT TO UNLOCK THESE POWERFUL FEATURES.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <FeatureCard title="Security Evaluation (NIST AC)" />
          <FeatureCard title="SEO / Keyword Scoring" />
          <FeatureCard title="GEO Analytics & Source of Truth" />
          <FeatureCard title="PII Leakage Detection" />
          <FeatureCard title="Real-Time Alerts" />
          <FeatureCard title="SEO + Traffic Trends" />
          <FeatureCard title="Compliance (NIST AC Controls)" />
          <FeatureCard title="FARGUS AI Engine (NIST CA-7)" />
          <FeatureCard title="Predictive Threat Modeling" />
          <FeatureCard title="Metadata Website Scanner" />
          <FeatureCard title="Domain Heatmap" />
          <FeatureCard title="Reporting & Intelligence" />
        </div>
      </section>

      {/* SECURITY FEATURES */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-10">
          Our Security Scan Protects Against:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          <FeatureCard title="Website Malware & Viruses" />
          <FeatureCard title="Unwanted Intrusion / Location Monitoring" />
          <FeatureCard title="Hackers" />
          <FeatureCard title="Theft of Private or Corporate Information" />
          <FeatureCard title="Website Weakness Detection" />
          <FeatureCard title="SEO / Keyword Analysis Scoring" />
          <FeatureCard title="Security & Threat Assessment Scoring" />
          <FeatureCard title="PII Data Breach Monitoring" />
        </div>
      </section>

      {/* BUSINESS INFO */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center text-sm bg-slate-800 text-gray-200 rounded-lg shadow-md">
        <p>26Scan is a Product Owned by:</p>
        <p className="font-semibold mt-1 text-blue-300">
          SAMS / CAGE Code Registration: GARBD33K2B56 / 9K4E0
        </p>
        <p className="mt-2 text-gray-100">
          GENERAL BUSINESS CONSULTANTS and INFORMATION, LLC (GBCAIN)
        </p>
        <p className="text-gray-100">SDVOSB Certification Number - VSBC-52457298070</p>

        <p className="mt-4 text-gray-100">2439 County Road 61, Deatsville, Alabama, 36022</p>
        <p className="text-gray-100">Email: fred@gbcain.com</p>
        <p className="text-gray-100">Phone: 334-306-8737</p>

        <p className="mt-4 text-blue-300">https://www.GBCAIN.com</p>

        <p className="mt-6 text-xs text-gray-400">
          All intellectual property, including this code, data, logic, processes etc.
          remains the sole property of GBCAIN. This information is proprietary and
          should not be copied, shared, or reverse engineered.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-gray-200 py-4 text-center text-sm text-gray-200">
        <div className="space-x-6">
          <a href="/contact" className="hover:text-blue-400">Contact</a>
          <a href="/help" className="hover:text-blue-400">Help</a>
          <a href="/account" className="hover:text-blue-400">Account Information</a>
        </div>
        <p className="mt-4 text-xs">
          © {new Date().getFullYear()} 26Scan / GBCAIN
        </p>
      </footer>

    </div>
  );
}
