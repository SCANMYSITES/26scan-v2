import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("sessionToken")?.value;

    if (!token) {
      return NextResponse.json({ ok: false, user: null });
    }

    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.id, token));

    if (!userRecord || userRecord.length === 0) {
      return NextResponse.json({ ok: false, user: null });
    }

    return NextResponse.json({
      ok: true,
      user: userRecord[0],
    });
  } catch (err) {
    console.error("current user error:", err);
    return NextResponse.json({ ok: false, user: null });
  }
}
