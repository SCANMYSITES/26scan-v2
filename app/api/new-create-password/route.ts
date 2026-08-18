import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import argon2 from "argon2";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password, accountType } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Hash password using Argon2
    const passwordHash = await argon2.hash(password);

    await db
      .update(users)
      .set({
        passwordHash,
        accountType,
        isVerified: 1,
        termsAcceptedAt: new Date(),
        privacyAcceptedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.email, email));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CREATE PASSWORD ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error creating password." },
      { status: 500 }
    );
  }
}
