import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    return NextResponse.json({
      success: true,
      status: verification.status,
    });
  } catch (error: any) {
    console.error("verify/start error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to start verification" },
      { status: 500 }
    );
  }
}
