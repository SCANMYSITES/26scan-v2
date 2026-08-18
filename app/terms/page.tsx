"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 p-8">
      
      {/* HEADER */}
      <header className="flex items-center mb-8">
        <img src="/26scanlogo.png" alt="26Scan Logo" className="h-12 w-auto" />
        <span className="ml-3 text-2xl font-bold text-blue-400">26Scan</span>
      </header>

      {/* TERMS CONTENT */}
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>

      <div className="bg-slate-800 border border-slate-700 rounded p-6 max-w-3xl">
        <h2 className="text-lg font-semibold mb-2">Last Updated: 03‑19‑2026</h2>

        <p className="mb-4">
          Welcome to 26Scan.com. These Terms and Conditions (“Terms”) govern your
          use of our website, services, and any related features provided by
          26Scan (“we,” “our,” or “us”). By accessing or using our platform, you
          agree to comply with and be bound by these Terms.
        </p>

        <h2 className="mt-4 font-semibold">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By creating an account, using our services, or interacting with our
          platform, you confirm that you have read, understood, and agree to
          these Terms.
        </p>

        <h2 className="mt-4 font-semibold">2. SMS & Email Consent</h2>
        <p className="mb-4">
          By creating an account, you consent to receive SMS or email messages
          containing verification codes for authentication, 2FA login, and
          security alerts.
        </p>

        <h2 className="mt-4 font-semibold">3. User Responsibilities</h2>
        <p className="mb-4">
          You agree to use 26Scan only for lawful purposes and in accordance with
          these Terms.
        </p>

        <h2 className="mt-4 font-semibold">4. Intellectual Property</h2>
        <p className="mb-4">
          All content, branding, design, software, and materials on 26Scan are
          the property of 26Scan.
        </p>

        <h2 className="mt-4 font-semibold">5. Limitation of Liability</h2>
        <p className="mb-4">
          26Scan is provided “as‑is” without warranties of any kind.
        </p>

        <h2 className="mt-4 font-semibold">6. Privacy Policy</h2>
        <p className="mb-4">
          Your use of 26Scan is also governed by our Privacy Policy.
        </p>

        <h2 className="mt-4 font-semibold">7. Changes to Terms</h2>
        <p className="mb-4">
          We may update these Terms at any time. Continued use of the platform
          after changes are posted constitutes acceptance of the revised Terms.
        </p>

        <h2 className="mt-4 font-semibold">8. Contact Information</h2>
        <p className="mb-4">
          For questions, contact: support@26scan.com
        </p>
      </div>
      <div className="text-center mt-6">
  <Link
    href="/new-user"
    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
  >
    ← Return to Registration
  </Link>
</div>

    </main>
  );
}
