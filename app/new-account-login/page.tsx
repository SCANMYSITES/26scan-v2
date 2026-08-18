"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// GLOBAL SHARED COMPONENT
import NewUserButtons from "@/components/NewUserButtons";

export default function NewAccountLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [accountType, setAccountType] = useState<"individual" | "business" | null>(null);

  // Sync with localStorage AND update when NewUserButtons calls onSelect
  useEffect(() => {
    const storedType = localStorage.getItem("accountType");
    if (storedType === "individual" || storedType === "business") {
      setAccountType(storedType);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!accountType) {
        setError("Please select Individual or Business first.");
        setLoading(false);
        return;
      }

      // ✅ FIXED PATH: use existing /api/account-status
      const statusRes = await fetch("/api/account-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const statusData = await statusRes.json();

      if (statusData.exists) {
        setError("This email already exists. Returning-user login will be added soon.");
        setLoading(false);
        return;
      }

      // ✅ FIXED PATH: use existing /api/2fa/send-code
      const sendRes = await fetch("/api/2fa/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, accountType }),
      });

      if (!sendRes.ok) {
        throw new Error("Failed to send verification code.");
      }

      router.push(
  `/2fa/verify?email=${encodeURIComponent(email)}&accountType=${accountType}`
);

    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Create Your Account</h1>

      {/* Step 2 — Individual or Business selection */}
      <NewUserButtons
        accountType={accountType}
        onSelect={(type) => setAccountType(type)}
      />

      {accountType && (
        <p className="text-green-400 mt-4 text-center">
          Selected: {accountType === "individual" ? "Individual User" : "Business User"}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-lg shadow-md w-full max-w-md mt-6"
      >
        <label className="block text-gray-300 mb-2">Enter your email:</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-md bg-gray-700 text-white mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md mt-4"
        >
          {loading ? "Sending Code..." : "Continue"}
        </button>

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </form>
    </main>
  );
}
