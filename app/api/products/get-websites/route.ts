import { db } from "@/db/db";
import { users, websites } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email is required." },
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

    return NextResponse.json({
      ok: true,
      websites: userWebsites
    });

  } catch (err) {
    console.error("Get websites error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error retrieving websites." },
      { status: 500 }
    );
  }
}
