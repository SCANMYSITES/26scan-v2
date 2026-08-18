import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      stripeCustomerId,
      stripeSubscriptionId,
      subscriptionPlan,
      subscriptionStatus,
      trial_end,
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({
        stripeCustomerId,
        subscriptionPlan,
        subscriptionStatus,
        trial_end,
        updatedAt: new Date(),
      })
      .where(eq(users.email, email));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SUBSCRIPTION ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error saving subscription." },
      { status: 500 }
    );
  }
}
