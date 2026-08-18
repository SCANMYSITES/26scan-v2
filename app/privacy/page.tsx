"use client";

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-blue-400 mb-4">Privacy Policy</h1>

      <div className="bg-slate-800 p-6 rounded-lg max-w-3xl w-full text-sm leading-relaxed">
        <p className="mb-4 text-gray-300">
          <strong>Last Updated:</strong> 03‑19‑2026
        </p>

        <p className="mb-4">
          26Scan values your privacy. This policy explains how we collect, use,
          and protect your personal information when you use our platform.
        </p>

        <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
        <p className="mb-4">
          We collect account details (name, email, phone), website data for
          scanning, and usage analytics to improve service quality.
        </p>

        <h2 className="text-lg font-semibold mb-2">2. How We Use Your Data</h2>
        <p className="mb-4">
          Data is used for authentication, 2FA verification, service delivery,
          and security alerts. We never sell or share your information with
          third parties except as required by law.
        </p>

        <h2 className="text-lg font-semibold mb-2">3. Data Security</h2>
        <p className="mb-4">
          We use encryption, secure servers, and limited access controls to
          protect your data. However, no system is completely immune to
          unauthorized access.
        </p>

        <h2 className="text-lg font-semibold mb-2">4. Your Rights</h2>
        <p className="mb-4">
          You may request deletion or correction of your data at any time by
          contacting support@26scan.com.
        </p>

        <h2 className="text-lg font-semibold mb-2">5. Contact Us</h2>
        <p className="mb-4">
          For privacy questions, email <strong>privacy@26scan.com</strong>.
        </p>

        {/* Return button */}
        <div className="text-center mt-6">
          <Link
            href="/new-user"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          >
            ← Return to Registration
          </Link>
        </div>
      </div>
    </main>
  );
}
