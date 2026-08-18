"use client";

import { useState } from "react";

export default function NewSubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [locationCount, setLocationCount] = useState(1);
  const [includeFargus, setIncludeFargus] = useState(false);
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    try {
      setLoading(true);

      const res = await fetch("/api/new-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: "cus_123456789", // Replace with real Stripe customer ID
          billingCycle,
          locationCount,
          includeFargus,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to start checkout.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Checkout failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Subscription Setup</h1>

      {/* Billing Cycle */}
      <div style={{ marginTop: "20px" }}>
        <label>Billing Cycle:</label>
        <select
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value)}
        >
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
        </select>
      </div>

      {/* Location Count */}
      <div style={{ marginTop: "20px" }}>
        <label>Number of Locations:</label>
        <input
          type="number"
          min="1"
          value={locationCount}
          onChange={(e) => setLocationCount(Number(e.target.value))}
        />
      </div>

      {/* Fargus Toggle */}
      <div style={{ marginTop: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={includeFargus}
            onChange={(e) => setIncludeFargus(e.target.checked)}
          />
          Include FARGUS
        </label>
      </div>

      {/* Checkout Button */}
      <button
        onClick={startCheckout}
        disabled={loading}
        style={{
          marginTop: "30px",
          padding: "12px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        {loading ? "Starting Checkout..." : "Start Checkout"}
      </button>
    </div>
  );
}
