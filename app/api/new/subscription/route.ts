// S3 — Main Subscription API Route
// This file receives the frontend request and forwards it to create-checkout-session.ts

import { NextResponse } from "next/server";
import * as CheckoutSession from "./create-checkout-session";

export async function POST(req: Request) {
  try {
    // Convert incoming request to a new Request object
    const forwardedReq = new Request(req.url, {
      method: req.method,
      headers: req.headers,
      body: req.body,
    });

    // Call the checkout session creator
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
export {}; // 👈 tells TypeScript this file is a module


