import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId, smsCode } = await req.json();

    if (!userId || !smsCode) {
      return NextResponse.json({ ok: false, error: "Missing fields" });
    }

    // 1. Look up the user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json({ ok: false, error: "User not found" });
    }

    const found = user[0];

    // 2. Compare codes
    if (found.smsCode !== smsCode) {
      return NextResponse.json({ ok: false, error: "Incorrect code" });
    }

    // 3. Mark user as verified
    await db
      .update(users)
      .set({ isVerified: true })
      .where(eq(users.id, userId));

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("verify-sms error:", error);
    return NextResponse.json({ ok: false, error: error.message });
  }
}
