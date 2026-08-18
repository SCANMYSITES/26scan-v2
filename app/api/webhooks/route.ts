import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { subscriptions } from "@/db/schema/subscriptions";

import { eq } from "drizzle-orm";

export const config = {
  api: {
    bodyParser: false
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { ok: false, error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  const rawBody = await buffer(req.body);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json(
      { ok: false, error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {

      //
      // CHECKOUT COMPLETED
      //
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = session.metadata?.userId;
        const customerId = session.customer?.toString();
        const subscriptionId = session.subscription?.toString();

        const billingCycle = session.metadata?.billingCycle;
        const locationCount = session.metadata?.locationCount;
        const includeFargus = session.metadata?.includeFargus;

        if (!userId || !customerId || !subscriptionId) break;

        await db
          .update(users)
          .set({
            stripeCustomerId: customerId,
            subscriptionStatus: "active",
            billingCycle,
            locationCount,
            includeFargus
          })
          .where(eq(users.id, userId));

        break;
      }

      //
      // SUBSCRIPTION CREATED OR UPDATED
      //
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;

        const customerId = sub.customer.toString();
        const subscriptionId = sub.id;
        const priceId = sub.items.data[0].price.id;
        const status = sub.status;

        const currentPeriodEnd = new Date(
          (((sub as any).current_period_end ?? 0) * 1000)
        );

        // Metadata from checkout session
        const metadata = sub.metadata || {};
        const billingCycle = metadata.billingCycle;
        const locationCount = metadata.locationCount;
        const includeFargus = metadata.includeFargus;

        // Find user by stripeCustomerId
        const userRecord = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (!userRecord.length) break;

        const userId = userRecord[0].id;

        // Insert or update subscription record
        await db
          .insert(subscriptions)
          .values({
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            status,
            currentPeriodEnd,
            billingCycle,
            locationCount,
            includeFargus
          })
          .onConflictDoUpdate({
            target: subscriptions.stripeSubscriptionId,
            set: {
              status,
              currentPeriodEnd,
              stripePriceId: priceId,
              billingCycle,
              locationCount,
              includeFargus
            }
          });

        // Update user subscription status
        await db
          .update(users)
          .set({
            subscriptionStatus: status,
            stripePriceId: priceId,
            billingCycle,
            locationCount,
            includeFargus
          })
          .where(eq(users.id, userId));

        break;
      }

      //
      // SUBSCRIPTION CANCELED
      //
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const subscriptionId = sub.id;
        const customerId = sub.customer.toString();

        await db
          .update(subscriptions)
          .set({ status: "canceled" })
          .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

        await db
          .update(users)
          .set({ subscriptionStatus: "canceled" })
          .where(eq(users.stripeCustomerId, customerId));

        break;
      }

      //
      // INVOICE PAID (renewal)
      //
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        const subscriptionId = (invoice as any).subscription
          ? String((invoice as any).subscription)
          : null;

        if (!subscriptionId) break;

        const currentPeriodEnd = new Date(
          ((invoice.lines.data[0].period.end as any) ?? 0) * 1000
        );

        await db
          .update(subscriptions)
          .set({
            currentPeriodEnd,
            status: "active"
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ ok: true });

  } catch (err: any) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
