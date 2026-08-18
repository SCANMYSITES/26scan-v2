import { NextResponse } from "next/server";
import { db } from "@/lib/backup-db";
import { websites } from "@/lib/db/schema";

import { runSeoScan } from "@/lib/seo/seoScan";
import { calculateFargus } from "@/lib/fargus";
import { fetchMetadata } from "@/lib/metadata";
import { generateScreenshot } from "@/lib/screenshot";
import { checkSslValidity } from "@/lib/fargus/security/sslCheck";
import { runSecurityScanWrapper } from "@/app/api/security/runSecurityScanWrapper";
import { runPIIScan } from "@/lib/fargus/pii";

import { eq } from "drizzle-orm";

// GEO import added
import { runGeoScan } from "@/lib/geo/geoScan";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const userId = "00000000-0000-0000-0000-000000000000";

    // Run all scans
    const metadata = await fetchMetadata(url);
    const security = await runSecurityScanWrapper(url);
    const pii = await runPIIScan(url);
    const seo = await runSeoScan(url);
    const geo = await runGeoScan(url);

    // Screenshot (your existing screenshot system)
    const screenshot = await generateScreenshot(url);

    // SSL check (you already import checkSslValidity)
    const sslValid = await checkSslValidity(url);

    // Fargus score (your existing system)
    const fargusScore = calculateFargus({
      metadata,
      security,
      pii,
      seo,
      geo,
      sslValid,
    });

    // Insert into database
await db.insert(websites).values({
  userId,                                 // REQUIRED
  url,
  security,
  previousSecurity: null,                 // until you implement history
  pii,
  title: metadata?.title ?? null,
  description: metadata?.description ?? null,
  favicon: metadata?.favicon ?? null,
  platform: metadata?.platform ?? null,
  tech: null,                             // until tech scan is added
  seo,
  geo,
  statusCode: security?.statusCode ?? null,
  screenshot,
  fargusScore,

  // SECURITY MODULE FIELDS
  securityScore: security?.score ?? null,
  securityRiskLevel: security?.riskLevel ?? null,
  securityFindings: JSON.stringify(security?.findings ?? []),

  createdAt: new Date(),
});

    return NextResponse.json({
      success: true,
      url,
      metadata,
      security,
      pii,
      seo,
      geo,
      screenshot,
      sslValid,
      fargusScore,
    });
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { success: false, error: "Scan failed" },
      { status: 500 }
    );
  }
}
