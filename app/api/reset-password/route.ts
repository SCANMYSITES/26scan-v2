import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { hashPassword } from "../../../lib/auth"

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    
// 1) Guardrail: user must exist
const userRows = await db.select().from(users).where(eq(users.email, email));

if (!userRows.length) {
  return NextResponse.json(
    {
      ok: false,
      message: "No account found. Please complete New User Setup first."
    },
    { status: 404 }
  );
}

const user = userRows[0];

// 2) Validate code and expiration
if (user.resetCode !== code) {
  return NextResponse.json({ message: "Invalid code" }, { status: 400 });
}

if (Date.now() > user.resetCodeExpires) {
  return NextResponse.json({ message: "Reset code expired" }, { status: 400 });
}

    // 2) Validate code and expiration
    if (user.resetCode !== code) {
      return NextResponse.json({ message: "Invalid code" }, { status: 400 });
    }

    if (Date.now() > user.resetCodeExpires) {
      return NextResponse.json({ message: "Reset code expired" }, { status: 400 });
    }

    // 3) Update password
    const hashed = await hashPassword(newPassword);
    await db
      .update(users)
      .set({ passwordHash: hashed, resetCode: null, resetCodeExpires: null })
      .where(eq(users.email, email));

    return NextResponse.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
