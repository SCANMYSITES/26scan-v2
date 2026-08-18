"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewCreatePassword() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";
  const accountType = params.get("accountType") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/new/create-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          accountType,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create password.");
      }

      // Redirect to subscription page
      router.push(    
  `/subscribe?email=${encodeURIComponent(email)}&accountType=${accountType}`
);
      
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Create Your Password</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <p className="text-gray-300 mb-4">
          Email: <strong>{email}</strong>
          <br />
          Account Type: <strong>{accountType}</strong>
        </p>

        <label className="block text-gray-300 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-md bg-gray-700 text-white mb-4"
        />

        <label className="block text-gray-300 mb-2">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-3 rounded-md bg-gray-700 text-white mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md mt-4"
        >
          {loading ? "Saving..." : "Continue"}
        </button>

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </form>
    </main>
  );
}
