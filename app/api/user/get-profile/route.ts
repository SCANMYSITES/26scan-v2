import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Missing user email" }, { status: 400 });
    }

    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!userRecord || userRecord.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: userRecord[0] });
  } catch (err) {
    console.error("Profile route error:", err);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}
