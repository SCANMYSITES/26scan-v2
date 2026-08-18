import { NextResponse } from "next/server";
import { db } from "@/lib/backup-db";
import { websites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { runSecurityScanWrapper } from "@/app/api/security/runSecurityScanWrapper";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing website ID" },
        { status: 400 }
      );
    }

    // Load website
    const result = await db
      .select()
      .from(websites)
      .where(eq(websites.id, id));

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Website not found" },
        { status: 404 }
      );
    }

    const website = result[0];

    // Run full security scan using the wrapper
    const newSecurity = await runSecurityScanWrapper(website.url);
    const trendLines = newSecurity.trendLines ?? [];

    // Save new scan + move old scan to previousSecurity
    await db
      .update(websites)
      .set({
        previousSecurity: website.security ?? null,
        security: newSecurity,
      })
      .where(eq(websites.id, id));

    return NextResponse.json({
      id: website.id,
      url: website.url,
      security: newSecurity,
      previousSecurity: website.security ?? null,
      trendLines,
    });
  } catch (err) {
    console.error("API /security/scan error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
