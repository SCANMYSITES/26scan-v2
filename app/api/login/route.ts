import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    
const body = await req.json();
const email = body.email?.toLowerCase().trim();
const password = body.password;

if (!email) {
  return NextResponse.json(
    { error: "Email is required." },
    { status: 400 }
  );
}

const userRecord = await db
  .select()
  .from(users)
  .where(eq(users.email, email));



    if (!userRecord || userRecord.length === 0) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const user = userRecord[0];

    // ⭐ 1. Check verification status
    if (user.isVerified !== 1) {
      return NextResponse.json(
        { error: "Account not verified", redirect: "/2fa/verify-code" },
        { status: 403 }
      );
    }

    // ⭐ 2. Check 2FA timestamp
    if (!user.last2faAt) {
      return NextResponse.json(
        { redirect: "/2fa/send-code" },
        { status: 200 }
      );
    }

    // ⭐ 3. Check expiration (30 minutes)
    const last2fa = new Date(user.last2faAt);
    const expired =
      Date.now() - last2fa.getTime() > 1000 * 60 * 30;

    if (expired) {
      return NextResponse.json(
        { redirect: "/2fa/verify-code" },
        { status: 200 }
      );
    }

    // ⭐ 4. Password check (bcrypt)
    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Invalid password." },
        { status: 401 }
      );
    }

// ⭐ 6. SUCCESS → redirect based on accountType
// ⭐ 6. SUCCESS → unified routes
return NextResponse.json({
  success: true,
  redirect: user.subscriptionPlan
    ? "/user-home"          // returning user
    : "/select-product",    // new user
  userId: user.id
});


  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Unexpected login error." },
      { status: 500 }
    );
  }
}
