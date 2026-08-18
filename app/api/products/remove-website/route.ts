import { db } from "@/db/db";
import { websites } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { websiteId } = body;

    if (!websiteId) {
      return NextResponse.json(
        { ok: false, error: "websiteId is required." },
        { status: 400 }
      );
    }

    await db.delete(websites).where(eq(websites.id, websiteId));

    return NextResponse.json({
      ok: true,
      message: "Website removed."
    });

  } catch (err) {
    console.error("Remove website error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error removing website." },
      { status: 500 }
    );
  }
}
