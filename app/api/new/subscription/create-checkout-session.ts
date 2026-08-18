// S2 — Create Stripe Checkout Session
// This file creates the Stripe checkout session using your real tier tables.
// It supports 26Scan + FARGUS, monthly + annual, and graduated tier pricing.

import Stripe from "stripe";
import { NextResponse } from "next/server";
import { selectTier } from "./calc-tier";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      businessId,
      billingCycle,       // "monthly" | "annual"
      locationCount,      // number of locations
      includeFargus,      // boolean
    } = body;

    //
    // 1. SELECT 26SCAN TIER
    //
    const tier26Scan = selectTier("26scan", billingCycle, locationCount);

    if (!tier26Scan.priceId) {
      return NextResponse.json(
        { error: "Missing Stripe priceId for this tier range." },
        { status: 400 }
      );
    }

    //
    // 2. SELECT FARGUS TIER (if enabled)
    //
    let tierFargus = null;

    if (includeFargus) {
      tierFargus = selectTier("fargus", billingCycle, locationCount);

      if (!tierFargus.priceId) {
        return NextResponse.json(
          { error: "Missing FARGUS priceId for this tier range." },
          { status: 400 }
        );
      }
    }

    //
    // 3. CREATE STRIPE CHECKOUT SESSION
    //
    const lineItems: any[] = [
      {
        price: tier26Scan.priceId,
        quantity: locationCount,
      },
    ];

    if (tierFargus) {
      lineItems.push({
        price: tierFargus.priceId,
        quantity: locationCount,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: businessId, // businessId = Stripe customer ID
      line_items: lineItems,
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          businessId,
          locationCount,
          includeFargus,
          billingCycle,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/new/user-home?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/new/subscription`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}
