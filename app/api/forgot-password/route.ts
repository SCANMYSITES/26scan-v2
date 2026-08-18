import { db } from "@/db/db";
import { users, passwordResetCodes } from "../../../db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    // 1) Validate email
    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Email is required." },
        { status: 400 }
      );
    }

    // 2) Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "No account found with that email." },
        { status: 404 }
      );
    }

    // 3) Remove any existing reset codes for this user
    await db.delete(passwordResetCodes).where(
      eq(passwordResetCodes.userId, user.id)
    );

    // 4) Generate new reset code
    const code = crypto.randomInt(100000, 999999).toString();

    // 5) Insert reset code
    await db.insert(passwordResetCodes).values({
      userId: user.id,
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 minutes
    });

    // 6) Send email (plug in your real sender)
    // await sendEmail(user.email, {
    //   subject: "Password Reset Code",
    //   text: `Your password reset code is ${code}.
    //
    //   Reminder: Your new password must be at least 12 characters
    //   and follow strong security guidelines.`
    // });

    return NextResponse.json({
      ok: true,
      message: "Password reset code sent. Check your email."
    });

  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
