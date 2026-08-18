"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OnboardingProfile() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email"); // optional if using session

  const [form, setForm] = useState({
    phone: "",
    accountType: "",
    businessName: "",
    businessWebsite: "",
    businessPhone: "",
    industry: "",
    address: "",
    zip: "",
    initialWebsite: "",
    subscriptionPlan: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/onboarding/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, ...form }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to save profile");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Complete Your Profile</h2>

      <p>Email: <strong>{email}</strong></p>

      <div style={{ marginTop: 20 }}>
        <label>Account Type</label>
        <select
          value={form.accountType}
          onChange={(e) => update("accountType", e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 5 }}
        >
          <option value="">Select...</option>
          <option value="individual">Individual</option>
          <option value="business">Business</option>
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Business Name</label>
        <input
          value={form.businessName}
          onChange={(e) => update("businessName", e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Business Website</label>
        <input
          value={form.businessWebsite}
          onChange={(e) => update("businessWebsite", e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Industry</label>
        <input
          value={form.industry}
          onChange={(e) => update("industry", e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Address</label>
        <input
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Zip</label>
        <input
          value={form.zip}
          onChange={(e) => update("zip", e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Initial Website to Scan</label>
        <input
          value={form.initialWebsite}
          onChange={(e) => update("initialWebsite", e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />
      </div>

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: 30,
          padding: "12px 20px",
          width: "100%",
          fontSize: 18,
        }}
      >
        {loading ? "Saving..." : "Continue to Dashboard"}
      </button>
    </div>
  );
}
