"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Load user
  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.ok) setUser(data.user);
    }
    loadUser();
  }, []);

  // Load Stripe products
  useEffect(() => {
    async function loadProducts() {
      const res = await fetch("/api/stripe-products");
      const data = await res.json();
      if (data.ok) {
        // Sort so 26Scan appears first
        const sorted = data.products.sort((a: any, b: any) =>
          a.name.includes("26Scan") ? -1 : 1
        );
        setProducts(sorted);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  // Handle checkout (UPGRADES ONLY)
  async function handlePurchase(priceId: string) {
    if (!user) {
      router.push("/"); // redirect to landing page
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        price_id: priceId,
        userId: user.id
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
    return (
      <div className="p-10 text-gray-100">
        Loading pricing…
      </div>
    );
  }

  return (
    <div className="p-10 text-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-blue-400">
        Pricing Plans
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {products.map((p) => (
          <div
            key={p.product_id}
            className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          >
            <h2 className="text-2xl font-semibold text-blue-300 mb-2">
              {p.name}
            </h2>

            <p className="text-gray-300 mb-4">{p.description}</p>

            {p.prices.map((price: any) => (
              <div key={price.price_id} className="mb-4">
                <p className="text-gray-200">
                  {price.billing_interval}:{" "}
                  <span className="text-blue-300 font-semibold">
                    ${price.amount?.toFixed(2)}
                  </span>
                </p>

                <button
                  onClick={() => handlePurchase(price.price_id)}
                  className={`inline-block mt-2 ${
                    user
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-gray-600 hover:bg-gray-700"
                  } text-white py-2 px-4 rounded-lg`}
                >
                  {user ? "Purchase" : "Log in to Purchase"}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
