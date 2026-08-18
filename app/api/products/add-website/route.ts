import { db } from "@/db/db";
import { users, websites } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, url } = body;

    if (!email || !url) {
      return NextResponse.json(
        { ok: false, error: "Email and URL are required." },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found." },
        { status: 404 }
      );
    }

    const userWebsites = await db.query.websites.findMany({
      where: eq(websites.userId, user.id)
    });

    const plan = user.subscriptionPlan;

    const limits = {
      basic: 1,
      pro: 5,
      enterprise: Infinity
    };

    if (userWebsites.length >= limits[plan]) {
      return NextResponse.json(
        { ok: false, error: "Website limit reached for your plan." },
        { status: 403 }
      );
    }

    await db.insert(websites).values({
      userId: user.id,
      url
    });

    return NextResponse.json({
      ok: true,
      message: "Website added successfully."
    });

  } catch (err) {
    console.error("Add website error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error adding website." },
      { status: 500 }
    );
  }
}
