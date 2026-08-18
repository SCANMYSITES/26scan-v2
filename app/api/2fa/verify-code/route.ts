import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { users, verificationCodes } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Missing email or verification code." },
        { status: 400 }
      );
    }

    // Find the user
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

    // Find the verification code
    const codeRecord = await db
      .select()
      .from(verificationCodes)
      .where(eq(verificationCodes.userId, user.id));

    if (!codeRecord || codeRecord.length === 0) {
      return NextResponse.json(
        { error: "Verification code not found." },
        { status: 404 }
      );
    }

    const storedCode = codeRecord[0];

    if (storedCode.code !== code) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    // ⭐ UPDATE USER TO VERIFIED ⭐
    await db
      .update(users)
      .set({
        isVerified: 1,
        last2faAt: new Date()
      })
      .where(eq(users.id, user.id));

    // Delete the code
    await db
      .delete(verificationCodes)
      .where(eq(verificationCodes.userId, user.id));

    // Decide redirect based on accountType
    let redirectTo = "/dashboard";

    if (user.accountType === "business") {
      redirectTo = "/complete-profile-business";
    } else if (user.accountType === "individual") {
      redirectTo = "/complete-profile-individual";
    }

    return NextResponse.json({
      success: true,
      userId: user.id,
      redirectTo
    });

  } catch (error) {
    console.error("2FA verify error:", error);
    return NextResponse.json(
      { error: "Unexpected error verifying code." },
      { status: 500 }
    );
  }
}
