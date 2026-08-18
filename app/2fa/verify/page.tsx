"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Verify2FA() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";
  const accountType = params.get("accountType") || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/2fa/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid verification code");
      }

      if (accountType === "individual") {
        router.push(`/new-complete-profile-ind?email=${encodeURIComponent(email)}`);
      } else {
        router.push(`/new-complete-profile-bus?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Verify Your Code</h1>

      <form
        onSubmit={handleVerify}
        className="bg-slate-800 p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <p className="text-gray-300 mb-4">
          A verification code was sent to:
          <br />
          <strong>{email}</strong>
        </p>

        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          placeholder="Enter 6‑digit code"
          className="w-full p-3 rounded-md bg-gray-700 text-white mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </form>
    </main>
  );
}
