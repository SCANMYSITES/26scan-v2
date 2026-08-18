import { NextResponse } from "next/server";
import { db } from "@/db/db";          // ✅ YOUR REAL PATH
import { users } from "@/db/schema";   // ✅ YOUR REAL PATH
import { eq } from "drizzle-orm";

// Normalize phone number into +1XXXXXXXXXX format
function normalizePhone(phone: string) {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("1")) {
    return `+${cleaned}`;
  }

  return `+1${cleaned}`;
}

export async function POST(req: Request) {
  try {
    // Read incoming data
    const { name, email, phone } = await req.json();

    // Log what we received
    console.log("Incoming request:", { name, email, phone });

    // Basic validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and phone are required." },
        { status: 400 }
      );
    }

    // Normalize phone BEFORE checking DB
    const normalizedPhone = normalizePhone(phone);
    console.log("Normalized phone:", normalizedPhone);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.phone, normalizedPhone))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { ok: false, error: "User already exists." },
        { status: 409 }
      );
    }

const newUser = await db
  .insert(users)
  .values({
    fullName: name,
    email: email.toLowerCase(),
    phone: normalizedPhone,
    isVerified: false,
  })
  .returning({ id: users.id });

return NextResponse.json(
  { ok: true, userId: newUser[0].id },
  { status: 201 }
);


return NextResponse.json(
  { ok: true, userId: newUser[0].id },   // ✔ now valid
  { status: 201 }
);


    return NextResponse.json(
      { ok: true, message: "User created successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("new-user route error:", error);
    return NextResponse.json(
      { ok: false, error: "Server error. Could not create user." },
      { status: 500 }
    );
  }
}
