import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email required" });
    }

    // Look up user (Drizzle PG returns an array)
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (userRows.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const user = userRows[0];

    // Generate NEW reset code every time
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 90-second expiration
    const expiresAt = new Date(Date.now() + 90 * 1000);

    // Save code + expiration
    await db
      .update(users)
      .set({
        resetCode,
        resetCodeExpires: expiresAt.getTime(), 
      })
      .where(eq(users.email, email));

    // SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your 26Scan Password Reset Code",
      text: `Your password reset code is: ${resetCode}\n\nThis code expires in 90 seconds.`,
    });

    return NextResponse.json({ success: true, message: "Reset code sent" });
  } catch (err) {
    console.error("SEND EMAIL OTP ERROR:", err);
    return NextResponse.json({ success: false, message: "Server error sending reset code" });
  }
}
