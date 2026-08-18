import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { users, verificationCodes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { signSession } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

// Normalize phone numbers (digits only)
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = body.email?.toLowerCase().trim();
    const code = body.code?.trim();

    const accountType = body.accountType; // "business" | "individual"
    const phone = body.phone ? normalizePhone(body.phone) : null;

    const termsAccepted = body.termsAccepted === true;
    const privacyAccepted = body.privacyAccepted === true;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email and code are required." },
        { status: 400 }
      );
    }

    // 1️⃣ Lookup user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found.", route: "/register" },
        { status: 404 }
      );
    }

    // 2️⃣ Lookup verification code
    const vcode = await db.query.verificationCodes.findFirst({
      where: and(
        eq(verificationCodes.userId, user.id),
        eq(verificationCodes.code, code),
        eq(verificationCodes.type, "signup")
      )
    });

    if (!vcode) {
      return NextResponse.json(
        { success: false, message: "Invalid code." },
        { status: 400 }
      );
    }

    // 3️⃣ Check expiration
    if (new Date(vcode.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Code expired.", route: "/resend" },
        { status: 400 }
      );
    }

    // 4️⃣ Update user as verified + store onboarding fields
    await db
      .update(users)
      .set({
        isVerified: 1,
        accountType: accountType || user.accountType,
        phone: phone || user.phone,
        termsAcceptedAt: termsAccepted ? new Date() : user.termsAcceptedAt,
        privacyAcceptedAt: privacyAccepted ? new Date() : user.privacyAcceptedAt,
        last2faAt: new Date()
      })
      .where(eq(users.id, user.id));

    // 5️⃣ Create final JWT session cookie
    const token = signSession({
      userId: user.id,
      email: user.email,
      verified: true,
      last2faAt: new Date().toISOString()
    });

    const res = NextResponse.json({ success: true });

    res.headers.append(
      "Set-Cookie",
      `sessionToken=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax`
    );

    // 6️⃣ Determine next route (profile completion or dashboard)
    const needsProfile =
      !user.businessName ||
      !user.businessWebsite ||
      !user.address ||
      !user.zip ||
      !user.initialWebsite;

    return NextResponse.json({
      success: true,
      route: needsProfile ? "/complete-profile" : "/user-home"
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { success: false, message: "Verification failed." },
      { status: 500 }
    );
  }
}

// 7️⃣ Resend code endpoint (same file)
export async function GET(req: Request) {
  try {
    const email = req.headers.get("x-email")?.toLowerCase().trim();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email required." },
        { status: 400 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // Generate new code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save new code
    await db.insert(verificationCodes).values({
      userId: user.id,
      code: newCode,
      method: "email",
      type: "signup",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send email
    await sendVerificationEmail(email, newCode);

    return NextResponse.json({ success: true, message: "Code resent." });
  } catch (error) {
    console.error("Resend code error:", error);
    return NextResponse.json(
      { success: false, message: "Resend failed." },
      { status: 500 }
    );
  }
}
