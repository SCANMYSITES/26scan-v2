import { NextResponse } from "next/server";
import Stripe from "stripe";
import { selectTier } from "./calc-tier";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16" as any,   // ← FIXED
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

const {
  stripeCustomerId,
  userId,
  billingCycle,
  locationCount,
  includeFargus,
} = body;


    // Calculate tier pricing
    const tier = selectTier({
      billingCycle,
      locationCount,
      includeFargus,
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      line_items: [
        {
          price: tier.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          billingCycle,
          locationCount,
          includeFargus,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/new-subscription?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("CHECKOUT SESSION ERROR:", error);
    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 }
    );
  }
}

export {};
