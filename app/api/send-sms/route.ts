import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const { userId, phoneNumber } = await req.json();

    console.log("SMS phone:", phoneNumber);

    if (!phoneNumber) {
      return NextResponse.json(
        { ok: false, error: "Missing phone number" },
        { status: 400 }
      );
    }

    // Generate a 6-digit code
    const smsCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("SMS code:", smsCode);

    // Send SMS via Twilio
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    await client.messages.create({
      body: `Your verification code is: ${smsCode}`,
      from: "+18334546770",
      to: phoneNumber,
    });

    return NextResponse.json(
      { ok: true, smsCode },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("SMS error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send SMS" },
      { status: 500 }
    );
  }
}
