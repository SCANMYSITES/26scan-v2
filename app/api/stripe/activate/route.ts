import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { users, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    // 1. Retrieve checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.customer || !session.subscription) {
      return NextResponse.json(
        { error: "Invalid session: missing customer or subscription" },
        { status: 400 }
      );
    }

    const customerId = session.customer.toString();
    const subscriptionId = session.subscription.toString();

    // 2. Retrieve subscription details
    const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

    const planId = stripeSub.items.data[0].price.id;
    const status = stripeSub.status;
const currentPeriodEnd = new Date(
  ((stripeSub as any).current_period_end ?? 0) * 1000
);


    // 3. Find user by Stripe customer ID
    const user = await db
      .select()
      .from(users)
      .where(eq(users.stripeCustomerId, customerId))
      .limit(1);

    if (!user.length) {
      return NextResponse.json(
        { error: "User not found for this Stripe customer" },
        { status: 404 }
      );
    }

    const userId = user[0].id;

    // 4. Update subscription table
    await db
      .insert(subscriptions)
      .values({
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripePriceId: planId,
        status,
        currentPeriodEnd,
      })
      .onConflictDoUpdate({
        target: subscriptions.stripeSubscriptionId,
        set: {
          status,
          currentPeriodEnd,
          stripePriceId: planId,
        },
      });

    // 5. Redirect user to dashboard
    return NextResponse.json({
      success: true,
      redirectUrl: "/dashboard",
    });
  } catch (err: any) {
    console.error("Activation error:", err);
    return NextResponse.json(
      { error: "Activation failed", details: err.message },
      { status: 500 }
    );
  }
}
