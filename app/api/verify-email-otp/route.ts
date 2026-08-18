import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { users, verificationCodes } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({
        ok: false,
        message: "Missing email or verification code."
      });
    }

    // 1️⃣ FIND USER BY EMAIL
    const userRows = await db.select().from(users).where(eq(users.email, email));
    if (!userRows.length) {
      return NextResponse.json({
        ok: false,
        message: "Account not found."
      });
    }

    const user = userRows[0];

    // 2️⃣ FIND MATCHING VERIFICATION CODE
    const codeRows = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.userId, user.id),
          eq(verificationCodes.code, code),
          eq(verificationCodes.type, "signup")
        )
      );

    if (!codeRows.length) {
      return NextResponse.json({
        ok: false,
        message: "Invalid verification code."
      });
    }

    const codeRecord = codeRows[0];

    // 3️⃣ CHECK EXPIRATION
    if (new Date() > new Date(codeRecord.expiresAt)) {
      return NextResponse.json({
        ok: false,
        message: "Verification code has expired."
      });
    }

    // 4️⃣ MARK USER AS VERIFIED
    await db
      .update(users)
      .set({ isVerified: 1 })
      .where(eq(users.id, user.id));

    // 5️⃣ DELETE USED VERIFICATION CODE
    await db
      .delete(verificationCodes)
      .where(eq(verificationCodes.id, codeRecord.id));

    // 6️⃣ SUCCESS → REDIRECT TO DASHBOARD
    return NextResponse.json({
      ok: true,
      message: "Email verified successfully.",
      redirect: "/dashboard"
    });

  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
