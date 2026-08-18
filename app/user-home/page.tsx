"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  phone: string | null;
  accountType: "business" | "individual" | null;
  businessName: string | null;
  businessWebsite: string | null;
  address: string | null;
  zip: string | null;
  isVerified: number | boolean;
  profileComplete: boolean;
};

type SubscriptionPlan = {
  product_id: string;
  price_id: string;
  name: string;
  interval: string;
  amount: number;
  tier: {
    first: number;
    last: number;
  };
  max_locations: number;
};

type SubscriptionUsage = {
  location_count: number;
  over_limit: boolean;
  remaining_locations: number;
};

type SubscriptionTrial = {
  is_trialing: boolean;
  trial_end: number | null;
};

type SubscriptionResponse = {
  ok: boolean;
  plan: SubscriptionPlan;
  usage: SubscriptionUsage;
  trial: SubscriptionTrial;
  status: string;
};

export default function UserHomeDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------
  // LOAD USER PROFILE + CLIENT-SIDE REDIRECTS
  // ---------------------------------------------

// REPLACE YOUR ENTIRE useEffect WITH THIS
useEffect(() => {
  async function fetchUser() {
    try {
      const res = await fetch("/api/user/get-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: localStorage.getItem("email")
        })
      });

      const data = await res.json();

      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Error loading user:", err);
    }
  }

  fetchUser();
}, []);

  // ---------------------------------------------
  // LOAD SUBSCRIPTION + CLIENT-SIDE REDIRECTS
  // ---------------------------------------------
  useEffect(() => {
    if (!user?.email) return;

    async function loadSubscription() {
      try {
        const res = await fetch("/api/user/subscription", {
          headers: {
            "x-user-email": user.email,
          },
        });

        const data: SubscriptionResponse = await res.json();

        if (!data.ok) {
          console.error("Subscription error:", data);
          return;
        }

        // SUBSCRIPTION GATING
        if (data.status !== "active") {
          router.push("/pricing");
          return;
        }

        setSubscription(data);
      } catch (err) {
        console.error("Error loading subscription:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSubscription();
  }, [user, router]);

  // ---------------------------------------------
  // LOADING STATE
  // ---------------------------------------------
  if (!user || loading || !subscription) {
    return (
      <div className="min-h-screen bg-[#0A1A2F] text-white flex items-center justify-center">
        <div className="text-sm text-gray-300">
          Loading your dashboard and subscription…
        </div>
      </div>
    );
  }

  const isBusiness = user.accountType === "business";

  const friendlyIndividualName = (() => {
    if (!user.email) return "User";
    const localPart = user.email.split("@")[0];
    const firstSegment = localPart.split(/[._-]/)[0];
    if (!firstSegment) return "User";
    return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
  })();

  const ownerLabel = isBusiness
    ? user.businessName || user.email
    : `${friendlyIndividualName}’s Dashboard`;

  const welcomeTitle = isBusiness
    ? `Welcome, ${user.businessName || user.email} Dashboard`
    : `Welcome, ${friendlyIndividualName}’s Dashboard`;

  const { plan, usage, trial, status } = subscription;

  const hasFargus = false;

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white flex flex-col">
      {/* TOP NAV */}
      <header className="w-full border-b border-[#1E3A5F] bg-[#0D2138] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold text-blue-300">26Scan + FARGUS</div>

          <nav className="flex items-center gap-4 text-sm">
            <Link href="/products" className="hover:text-blue-300">Products</Link>
            <Link href="/pricing" className="hover:text-blue-300">Pricing</Link>
            <Link href="/contact" className="hover:text-blue-300">Contact Us</Link>
            <Link href="/documents" className="hover:text-blue-300">Documents</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-300 hidden md:inline">{ownerLabel}</span>

          <div className="relative group">
            <button className="hover:text-blue-300">Account Settings ▾</button>

            <div className="hidden group-hover:block absolute right-0 mt-2 bg-[#11263F] border border-[#1E3A5F] rounded shadow-lg text-sm min-w-48 z-10">
              <Link href="/dashboard/account" className="block w-full text-left px-4 py-2 hover:bg-[#1A3454]">Profile & Security</Link>
              <Link href="/contact" className="block w-full text-left px-4 py-2 hover:bg-[#1A3454]">Contact Support</Link>
              <Link href="/fargus" className="block w-full text-left px-4 py-2 hover:bg-[#1A3454]">FARGUS AI Assistant</Link>
              <Link href="/logout" className="block w-full text-left px-4 py-2 hover:bg-[#1A3454]">Logout</Link>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside className="w-64 border-r border-[#1E3A5F] bg-[#0D2138] p-4">
          <h2 className="text-sm font-semibold mb-3 text-gray-200">Product Modules</h2>

          <nav className="space-y-2 text-sm">
            <SidebarItem label="AI Intelligence Monitor" link="/dashboard/ai-risk" />
            <SidebarItem label="Compliance Suite" link="/dashboard/compliance" />
            <SidebarItem label="Website Scanner" link="/dashboard/website-scanner" />
            <SidebarItem label="Domain Scanner" link="/dashboard/domain-scanner" />
            <SidebarItem label="AI Insights" link="/dashboard/ai-insights" />
            <SidebarItem label="Reports" link="/dashboard/reports" />
            <SidebarItem label="Settings" link="/dashboard/settings" />
            <SidebarItem label="Billing" link="/dashboard/billing" />
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-2">{welcomeTitle}</h1>
          <p className="text-gray-300 mb-6 text-sm max-w-3xl">
            Your unified dashboard for SEO Metadata Review, GEO intelligence,
            security scanning, PII monitoring, alerts, and AI Intelligence insights —
            all powered by 26Scan, with optional FARGUS Watchman for continuous monitoring.
          </p>

          {/* SUBSCRIPTION SUMMARY */}
          <section className="mb-6 bg-[#11263F] border border-[#1E3A5F] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2 text-white">Subscription Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-200">
              <div>
                <div className="font-semibold">Plan</div>
                <div>{plan.name}</div>
                <div className="text-xs text-gray-400">
                  {plan.interval} • ${plan.amount.toFixed(2)} / {plan.interval}
                </div>
              </div>
              <div>
                <div className="font-semibold">Locations</div>
                <div>{usage.location_count} of {plan.max_locations} used</div>
                {usage.over_limit && (
                  <div className="text-xs text-red-400">
                    Over limit — please upgrade your plan.
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold">Status</div>
                <div className="capitalize">{status}</div>
                {trial.is_trialing && (
                  <div className="text-xs text-yellow-300">
                    Trial active — ends at {trial.trial_end ?? "N/A"}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* PRODUCT TILES */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <ProductTile
              title="AI Intelligence Monitor"
              link="/dashboard/ai-risk"
              description="SEO, GEO, Security, PII, Alerts"
              features={[
                "SEO Metadata Review Engine",
                "GEO Intelligence",
                "Security & OWASP checks",
                "PII exposure monitoring",
                "Risk & change alerts",
              ]}
            />

            <ProductTile
              title="Compliance Suite"
              link="/dashboard/compliance"
              description="Scoring, Alerts, Documents"
              features={[
                "Compliance scoring",
                "Compliance alerts",
                "Compliance reports",
                "Exportable documents",
              ]}
            />

            <ProductTile
              title="Website Scanner"
              link="/dashboard/website-scanner"
              description="Malware, Vulnerabilities, SEO, Performance"
              features={[
                "Malware detection",
                "Vulnerability scan",
                "SEO / GEO performance",
                "Load speed analysis",
              ]}
            />

            <ProductTile
              title="Domain Scanner"
              link="/dashboard/domain-scanner"
              description="DNS, SSL, WHOIS, Expiration"
              features={[
                "DNS checks",
                "SSL validation",
                "WHOIS & ownership",
                "Expiration monitoring",
              ]}
            />

            <ProductTile
              title="AI Insights"
              link="/dashboard/ai-insights"
              description="Predictions, Recommendations, Threat Forecasting"
              features={[
                "Risk predictions",
                "AI recommendations",
                "Threat forecasting",
                "Anomaly detection",
              ]}
            />

            <ProductTile
              title="Reports"
              link="/dashboard/reports"
              description="Website, Domain, Compliance"
              features={[
                "Website reports",
                "Domain reports",
                "Compliance reports",
                "Printable / exportable",
              ]}
            />

            <ProductTile
              title="Settings"
              link="/dashboard/settings"
              description="Profile, Security, Notifications"
              features={[
                "Profile settings",
                "Account security",
                "Notification preferences",
                "Integration settings",
              ]}
            />

            <ProductTile
              title="Billing"
              link="/dashboard/billing"
              description="Subscriptions, Invoices, Payments"
              features={[
                "Subscription plans",
                "Invoices & history",
                "Payment methods",
                "Upgrade / downgrade",
              ]}
            />

            <FargusTile hasFargus={hasFargus} />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ label, link }: { label: string; link: string }) {
  return (
    <Link
      href={link}
      className="block w-full text-left px-3 py-2 rounded bg-[#11263F] hover:bg-[#1A3454] text-gray-200"
    >
      {label}
    </Link>
  );
}

type ProductTileProps = {
  title: string;
  description: string;
  features: string[];
  link: string;
};

function ProductTile({ title, description, features, link }: ProductTileProps) {
  return (
    <Link href={link}>
      <div className="bg-[#11263F] border border-[#1E3A5F] rounded-lg p-4 hover:border-blue-500 hover:shadow-lg transition cursor-pointer">
        <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
        <p className="text-gray-300 text-sm mb-3">{description}</p>

        <ul className="text-xs text-gray-300 space-y-1">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

function FargusTile({ hasFargus }: { hasFargus: boolean }) {
  const tileClassesEnabled =
    "bg-[#11263F] border border-[#1E3A5F] rounded-lg p-4 hover:border-blue-500 hover:shadow-lg transition cursor-pointer";
  const tileClassesDisabled =
    "bg-[#0A1524] border border-[#1E3A5F] rounded-lg p-4 cursor-pointer opacity-60";

  const label = hasFargus
    ? "FARGUS Watchman (Active)"
    : "FARGUS Watchman — Upgrade";

  const description = hasFargus
    ? "Continuous alerts, monitoring, and AI driven guardrails."
    : "Enable FARGUS for continuous alerts, monitoring, and AI driven guardrails.";

  const features = hasFargus
    ? [
        "Real time alerts & monitoring",
        "AI driven anomaly detection",
        "Guardrails for website changes",
        "Integrated with 26Scan modules",
      ]
    : [
        "Upgrade to enable real time alerts",
        "AI driven anomaly detection",
        "Continuous monitoring add on",
        "$9.99/month FARGUS Watchman",
      ];

  const targetLink = hasFargus ? "/dashboard/fargus" : "/dashboard/billing";

  return (
    <Link href={targetLink}>
      <div className={hasFargus ? tileClassesEnabled : tileClassesDisabled}>
        <h3 className="text-lg font-semibold mb-2 text-white">{label}</h3>
        <p className="text-gray-300 text-sm mb-3">{description}</p>

        <ul className="text-xs text-gray-300 space-y-1">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span
                className={
                  hasFargus
                    ? "inline-block w-2 h-2 rounded-full bg-blue-400"
                    : "inline-block w-2 h-2 rounded-full bg-gray-500"
                }
              />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
