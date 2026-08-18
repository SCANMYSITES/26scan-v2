import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { computeEntitlements } from "@/lib/entitlements";

export async function GET(request: Request) {
  try {
    const email = request.headers.get("x-user-email");

    if (!email) {
      return NextResponse.json(
        { error: "Missing user email" },
        { status: 400 }
      );
    }

    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (userRecord.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = userRecord[0];

    // Extract subscription fields
    const priceId = user.subscriptionPlan;
    const locationCount = user.location_count ?? 1;
    const status = user.subscriptionStatus ?? "active";
    const trialEnd = user.trial_end ?? null;

    // Compute entitlements (tier, max locations, cost, interval, etc.)
    const entitlements = computeEntitlements(priceId, locationCount);

    // Unified dashboard JSON
    return NextResponse.json({
      ok: true,

      // PLAN DETAILS
      plan: {
        product_id: entitlements.product_id,
        price_id: entitlements.price_id,
        name: entitlements.description,
        interval: entitlements.interval,
        amount: entitlements.amount,
        tier: entitlements.tier,
        max_locations: entitlements.max_locations
      },

      // USAGE DETAILS
      usage: {
        location_count: locationCount,
        over_limit: locationCount > entitlements.max_locations,
        remaining_locations: Math.max(entitlements.max_locations - locationCount, 0)
      },

      // TRIAL DETAILS
      trial: {
        is_trialing: status === "trialing",
        trial_end: trialEnd
      },

      // SUBSCRIPTION STATUS
      status
    });

  } catch (error) {
    console.error("Subscription lookup error:", error);
    return NextResponse.json(
      { error: "Failed to load subscription" },
      { status: 500 }
    );
  }
}
