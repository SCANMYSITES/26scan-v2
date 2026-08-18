"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/account-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Unable to check account status.");
        setLoading(false);
        return;
      }

      // Store email for later steps (2FA, profile, etc.)
      localStorage.setItem("userEmail", email);

      if (data.exists) {
        // RETURNING USER → go to login (password + 2FA)
        router.push("/login");
      } else {
        // NEW USER → go to 2FA send-code for onboarding
        router.push("/send-code");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        Account Login
      </h1>

      <p className="text-gray-300 mb-4 max-w-md text-center">
        Enter your email. We&apos;ll check if you already have an account
        and guide you through login or new user setup.
      </p>

      <form
        onSubmit={handleContinue}
        className="bg-slate-800 p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg"
      >
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded bg-white text-black border border-gray-300"
          required
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-900 text-white font-semibold py-2 rounded transition"
        >
          {loading ? "Checking account..." : "Continue"}
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-300 space-y-2">
        <button
          className="text-blue-300 hover:underline"
          onClick={() => router.push("/forgot-password")}
        >
          Forgot password?
        </button>
        <br />
        <button
          className="text-blue-300 hover:underline"
          onClick={() => router.push("/contact-support")}
        >
          Forgot login / need help?
        </button>
      </div>
    </main>
  );
}
