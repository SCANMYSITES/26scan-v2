import { db } from "@/db/db";
import { users, verificationCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email, accountType } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // STEP 1 — Check if user exists
    let user = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    // STEP 2 — If user does NOT exist → CREATE NEW USER
    if (!user) {
      const newUser = await db
        .insert(users)
        .values({
          email: normalizedEmail,
          passwordHash: "",           // ⭐ REQUIRED BY YOUR SCHEMA
          accountType: accountType,   // ⭐ IND or BUS
          isVerified: 0,
          createdAt: new Date(),
        })
        .returning();

      user = newUser[0];
    }

    // STEP 3 — Generate verification code
    const code = generateCode();

    await db.delete(verificationCodes).where(eq(verificationCodes.userId, user.id));

    await db.insert(verificationCodes).values({
      userId: user.id,
      code,
      method: "email",
      type: "login",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // STEP 4 — Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"26Scan Verification" <${process.env.SMTP_USER}>`,
      to: normalizedEmail,
      subject: "Your 26Scan Verification Code",
      html: `<p>Your verification code is:</p><h2>${code}</h2><p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/2fa/verify?email=${encodeURIComponent(normalizedEmail)}&accountType=${encodeURIComponent(accountType)}">Click here to verify your code</a></p>`,

    });

    return NextResponse.json({ ok: true, userId: user.id });
  } catch (err) {
    console.error("SEND CODE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to send code" },
      { status: 500 }
    );
  }
}
