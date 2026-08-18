"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CompleteProfileInd() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/complete-profile-ind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName,
          address,
          phone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save profile.");
      }

      router.push(
        `/new-create-password?email=${encodeURIComponent(email)}&accountType=individual`
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Complete Your Individual Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <p className="text-gray-300 mb-4">
          Email: <strong>{email}</strong>
        </p>

        <label className="block text-gray-300 mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full p-3 rounded-md bg-gray-700 text-white mb-4"
        />

        <label className="block text-gray-300 mb-2">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="w-full p-3 rounded-md bg-gray-700 text-white mb-4"
        />

        <label className="block text-gray-300 mb-2">Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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

