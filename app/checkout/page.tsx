"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useSearchParams();
  const priceId = params.get("price");

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const res = await fetch("/api/stripe-products");
      const data = await res.json();

      if (!data.ok) {
        setLoading(false);
        return;
      }

      // Flatten all prices across all products
      const allPrices = data.products.flatMap((p: any) =>
        p.prices.map((price: any) => ({
          ...price,
          productName: p.name,
          productId: p.product_id,
        }))
      );

      const match = allPrices.find((p: any) => p.price_id === priceId);

      setProduct(match || null);
      setLoading(false);
    }

    loadProducts();
  }, [priceId]);

  if (loading) {
    return (
      <div className="p-10 text-gray-100">
        <h1 className="text-2xl">Loading pricing…</h1>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-gray-100">
        <h1 className="text-3xl font-bold text-red-400">
          Invalid Checkout Link
        </h1>
        <p className="text-gray-300 mt-4">
          The selected product could not be found.
        </p>
      </div>
    );
  }

  const handleCheckout = async () => {
    const userId = localStorage.getItem("userId");

    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        priceId: product.price_id,
        userId,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="p-10 text-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">
        Checkout — {product.productName}
      </h1>

      <p className="text-lg mb-6 text-gray-300">
        Includes a{" "}
        <span className="text-blue-300 font-semibold">
          {product.trial_days}-day free trial
        </span>.
      </p>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg max-w-xl">
        <h2 className="text-2xl font-bold text-blue-300 mb-4">
          Billing: {product.billing_interval}
        </h2>

        {product.tiers?.length > 0 && (
          <>
            <h3 className="text-xl font-semibold mb-2 text-gray-200">
              Tiered Pricing
            </h3>

            <ul className="space-y-2 text-gray-300 mb-6">
              {product.tiers.map((tier: any, index: number) => (
                <li key={index}>
                  {tier.first}–{tier.last ?? "∞"} locations:{" "}
                  <span className="text-blue-300 font-semibold">
                    ${tier.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        <button
          onClick={handleCheckout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          Start Free Trial
        </button>
      </div>
    </div>
  );
}
