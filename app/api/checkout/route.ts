import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { locations } from "@/db/schema/locations";
import { subscriptions } from "@/db/schema/subscriptions";
import { eq } from "drizzle-orm";

import { computeEntitlements } from "@/lib/entitlements";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia"
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { priceId, userId } = body;

    if (!priceId || !userId) {
      return NextResponse.json(
        { ok: false, error: "Missing priceId or userId." },
        { status: 400 }
      );
    }

    //
    // 1. LOAD USER
    //
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!userRecord || userRecord.length === 0) {
      return NextResponse.json(
        { ok: false, error: "User not found." },
        { status: 404 }
      );
    }

    const user = userRecord[0];

    //
    // 2. COUNT LOCATIONS
    //
    const locationRows = await db
      .select()
      .from(locations)
      .where(eq(locations.userId, userId));

    const locationCount = locationRows.length || 1;

    //
    // 3. COMPUTE TIER BASED ON PRICE + LOCATION COUNT
    //
    const entitlements = computeEntitlements(priceId, locationCount);

    if (entitlements.error) {
      return NextResponse.json(
        { ok: false, error: entitlements.error },
        { status: 400 }
      );
    }

    //
    // 4. ENSURE STRIPE CUSTOMER EXISTS
    //
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email.toLowerCase().trim(),

        metadata: { userId }
      });

      stripeCustomerId = customer.id;

      await db
        .update(users)
        .set({ stripeCustomerId })
        .where(eq(users.id, userId));
    }

    //
    // 5. CREATE CHECKOUT SESSION
    //
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      customer: stripeCustomerId,

      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],

      metadata: {
        userId,
        locationCount,
        tierMax: entitlements.max_locations,
        interval: entitlements.interval,
        product: entitlements.description
      },

      subscription_data: {
        metadata: {
          userId,
          locationCount,
          tierMax: entitlements.max_locations,
          interval: entitlements.interval,
          product: entitlements.description
        }
      },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?sub=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?canceled=true`
    });

    //
    // 6. RETURN CHECKOUT URL
    //
    return NextResponse.json({
      ok: true,
      url: session.url
    });

  } catch (err: any) {
    console.error("Checkout Error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Checkout session failed." },
      { status: 500 }
    );
  }
}
