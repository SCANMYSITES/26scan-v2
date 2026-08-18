"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CompleteProfileBus() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";

  const [businessName, setBusinessName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/complete-profile-bus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          businessName,
          taxId,
          businessAddress,
          contactPerson,
          businessPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save business profile.");
      }

      router.push(
        `/new-create-password?email=${encodeURIComponent(email)}&accountType=business`
      );
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Complete Your Business Profile</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <p className="text-gray-300 mb-4">
          Email: <strong>{email}</strong>
        </p>

        <label className="block text-gray-300 mb-2">Business Name</label>
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          className="w-full p-3 rounded-md bg-gray-700 text-white mb-4"
        />

        <label className="block text-gray-300 mb-2">Tax ID / EIN</label>
        <input
          type="text"
          value={taxId}
          onChange={(e) => setTaxId(e.target.value)}
          required
          className="w-full p-3 rounded-md bg-gray-700 text-white mb-4"
        />

        <label className="block text-gray-300 mb-2">Business Address</label>
        <input
          type="text"
          value={businessAddress}
          onChange={(e) => setBusinessAddress(e.target.value)}
          required
          className="w-full p-3 rounded-md bg-gray-700 text-white mb-4"
        />

        <label className="block text-gray-300 mb-2">Contact Person</label>
        <input
          type="text"
          value={contactPerson}
          onChange={(e) => setContactPerson(e.target.value)}
          required
          className="w-full p-3 rounded-md bg-gray-700 text-white mb-4"
        />

        <label className="block text-gray-300 mb-2">Business Phone</label>
        <input
          type="text"
          value={businessPhone}
          onChange={(e) => setBusinessPhone(e.target.value)}
          required
          className="w-full p-3 rounded-md bg-gray-700 text-white mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md mt-4"
        >
          {loading ? "Saving..." : "Continue"}
        </button>

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
      </form>
    </main>
  );
}
