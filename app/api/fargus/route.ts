import { NextResponse } from "next/server";
import { runFargusEngine } from "./engine/engine";

/**
 * Fetch user entitlements from your existing entitlement API.
 * This assumes your endpoint returns:
 * { ok: boolean, entitlements: { hasFargus: boolean, ... } }
 */
async function getEntitlements() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/user/entitlements`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (!data.ok) return null;

    return data.entitlements;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    // 1️⃣ Check entitlement before running FARGUS
    const entitlements = await getEntitlements();

    if (!entitlements || !entitlements.hasFargus) {
      return NextResponse.json(
        {
          ok: false,
          error: "FARGUS entitlement required.",
          timestamp: Date.now(),
          meta: { route: "FARGUS API", entitlement: false }
        },
        { status: 403 }
      );
    }

    // 2️⃣ Parse request body
    const raw = await request.json();

    // 3️⃣ Run FARGUS engine
    const result = await runFargusEngine(raw);

    // 4️⃣ Return normalized result
    return NextResponse.json(result, { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error: err?.message ?? "Unknown error in FARGUS API route",
        timestamp: Date.now(),
        meta: { route: "FARGUS API" }
      },
      { status: 500 }
    );
  }
}
