import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

export async function POST(request: Request) {
  try {
    const { phoneNumber, code } = await request.json();

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: "Missing phone number or code" },
        { status: 400 }
      );
    }

    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code,
      });

    if (verificationCheck.status === "approved") {
      return NextResponse.json({
        success: true,
        message: "Authenticated successfully",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid or expired code" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("verify/check error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to check verification" },
      { status: 500 }
    );
  }
}
