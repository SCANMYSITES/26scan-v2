import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ✅ REAL DB LOOKUP
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    const exists = !!existingUser;

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("account-status error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
