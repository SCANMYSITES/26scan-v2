import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { sendVerificationEmail } from "@/lib/email";
import { signSession } from "@/lib/auth";

import { users, verificationCodes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existing = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail)
    });

    if (existing) {
      return NextResponse.json({
        success: false,
        message: "Email already exists",
        route: "/login"
      });
    }

    // 1️⃣ Create user (unverified)
    const [user] = await db.insert(users).values({
      email: normalizedEmail,
      passwordHash: password, // hash later
      isVerified: 0
    }).returning();

    // 2️⃣ Generate 2FA code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 3️⃣ Save code
    await db.insert(verificationCodes).values({
      userId: user.id,
      code,
      method: "email",
      type: "signup",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // 4️⃣ Send email
    await sendVerificationEmail(normalizedEmail, code);

    // 5️⃣ Set JWT session cookie (unverified)
    const token = signSession({
      userId: user.id,
      email: normalizedEmail,
      verified: false,
      last2faAt: null
    });

    const res = NextResponse.json({ success: true });
    res.headers.append(
      "Set-Cookie",
      `sessionToken=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax`
    );

    return res;

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
