import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      businessName,
      businessAddress,
      businessZip,
      businessWebsite,
      businessPhone,
      industry,
      contactPerson,
    } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({
        businessName,
        businessAddress,
        businessZip,
        businessWebsite,
        businessPhone,
        industry,
        fullName: contactPerson || null,
        profileCompleted: 1,
        profileCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.email, email));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("BUS PROFILE ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server error completing business profile." },
      { status: 500 }
    );
  }
}
