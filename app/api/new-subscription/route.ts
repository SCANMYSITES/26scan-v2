import { NextResponse } from "next/server";
import * as CheckoutSession from "./create-checkout-session";

export async function POST(req: Request) {
  try {
    const forwardedReq = new Request(req.url, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    });

    const result = await CheckoutSession.POST(forwardedReq);
    return result;
  } catch (error: any) {
    console.error("Subscription route error:", error);
    return NextResponse.json(
      { error: "Unable to process subscription request" },
      { status: 500 }
    );
  }
}

export {};
