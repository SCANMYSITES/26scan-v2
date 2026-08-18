"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SelectProductPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function handlePurchase(priceId: string) {
    if (!user) {
      router.push("/"); // redirect to landing page if not logged in
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price_id: priceId,
        email: user.email
      })
    });

    const data = await res.json();
    if (data.url) {
      router.push(data.url);
    } else {
      alert("Checkout failed.");
    }
  }

  if (loading) {
    return <div className="p-10 text-gray-100">Loading products…</div>;
  }

  return (
    <div className="p-10 text-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">
        Select Your Product
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* 26Scan Monthly */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            26Scan Monthly
          </h2>
          <p className="text-gray-300 mb-4">
            Full 26Scan platform: AI Intelligence, Compliance, Heatmap, PII, Scanners
          </p>
          <p className="text-gray-400 text-sm mb-2">
            Tier options available for multiple locations.
          </p>
          <p className="text-gray-200 mb-2">
            Monthly: <span className="text-blue-300 font-semibold">$34.99</span>
          </p>
          <button
            onClick={() => handlePurchase("price_1TtuE6DFcm24Wdf02misZJ4B")}
            className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Purchase
          </button>
        </div>

        {/* 26Scan Annual */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            26Scan Annual
          </h2>
          <p className="text-gray-300 mb-4">
            Full 26Scan platform billed annually
          </p>
          <p className="text-gray-400 text-sm mb-2">
            Tier options available for multiple locations.
          </p>
          <p className="text-gray-200 mb-2">
            Annual: <span className="text-blue-300 font-semibold">$419.88</span>
          </p>
          <button
            onClick={() => handlePurchase("price_1TtuHFDFcm24Wdf0wJwriW9p")}
            className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Purchase
          </button>
        </div>

        {/* FARGUS Monthly */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            FARGUS Intelligence Monthly
          </h2>
          <p className="text-gray-300 mb-4">
            AI Assistant + Watchman Monitoring
          </p>
          <p className="text-gray-400 text-sm mb-2">
            Tier options available for multiple locations.
          </p>
          <p className="text-gray-200 mb-2">
            Monthly: <span className="text-blue-300 font-semibold">$9.99</span>
          </p>
          <button
            onClick={() => handlePurchase("price_1TwACHDFcm24Wdf0bjfIkwGP")}
            className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Purchase
          </button>
        </div>

        {/* FARGUS Annual */}
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-2xl font-semibold text-blue-300 mb-2">
            FARGUS Intelligence Annual
          </h2>
          <p className="text-gray-300 mb-4">
            FARGUS Watchman billed annually
          </p>
          <p className="text-gray-400 text-sm mb-2">
            Tier options available for multiple locations.
          </p>
          <p className="text-gray-200 mb-2">
            Annual: <span className="text-blue-300 font-semibold">$95.00</span>
          </p>
          <button
            onClick={() => handlePurchase("price_1TwAklDFcm24Wdf0c0A6phQR")}
            className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Purchase
          </button>
        </div>

      </div>
    </div>
  );
}
