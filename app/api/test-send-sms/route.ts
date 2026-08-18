import { NextResponse } from "next/server";
import twilio from "twilio";

export async function GET() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body: "Twilio test message from 26Scan ✅",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+13343068737", // replace with your own verified phone number
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
