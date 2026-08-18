"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubscribePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    setUserId(storedId);
  }, []);

  const PLANS = [
    {
      id: "price_1TtuE6DFcm24Wdf02misZJ4B",
      title: "26Scan Monthly",
      description: "Continuous scanning & monitoring",
      interval: "Monthly",
      color: "bg-blue-600",
    },
    {
      id: "price_1TtuHFDFcm24Wdf0wJwriW9p",
      title: "26Scan Annual",
      description: "Annual billing with savings",
      interval: "Annual",
      color: "bg-blue-700",
    },
    {
      id: "price_1TwACHDFcm24Wdf0bjfIkwGP",
      title: "Fargus Intelligence Monthly",
      description: "AI threat intelligence & monitoring",
      interval: "Monthly",
      color: "bg-purple-600",
    },
    {
      id: "price_1TwAklDFcm24Wdf0c0A6phQR",
      title: "Fargus Intelligence Annual",
      description: "Annual billing with savings",
      interval: "Annual",
      color: "bg-purple-700",
    },
  ];

  const handleSelectPlan = async (priceId: string) => {
    if (!userId) {
      setError("User ID missing. Please log in again.");
      return;
    }

    setLoading(priceId);
    setError("");

    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, priceId }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Unable to start checkout.");
        setLoading(null);
        return;
      }

      router.push(data.url);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-400">
        Choose Your Subscription
      </h1>

      {error && (
        <p className="text-red-400 text-center mb-4 text-sm">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">{plan.title}</h2>
              <p className="text-gray-300 mb-4">{plan.description}</p>
              <p className="text-sm text-gray-400">
                Billing Interval: <span className="font-semibold">{plan.interval}</span>
              </p>
            </div>

            <button
              onClick={() => handleSelectPlan(plan.id)}
              disabled={loading === plan.id}
              className={`mt-6 w-full py-3 rounded-lg text-white font-semibold transition ${
                plan.color
              } ${loading === plan.id ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              {loading === plan.id ? "Processing..." : "Select Plan"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
