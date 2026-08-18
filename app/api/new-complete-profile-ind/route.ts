import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      firstName,
      lastName,
      address,
      zip,
      phone,
      initialWebsite,
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const fullName = `${firstName || ""} ${lastName || ""}`.trim();

    await db
      .update(users)
      .set({
        firstName,
        lastName,
        fullName,
        address,
        zip,
        phone,
        initialWebsite,
        profileCompleted: 1,
        profileCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.email, email));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("IND PROFILE ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error completing profile." },
      { status: 500 }
    );
  }
}
