import { db } from "@/lib/backup-db";
import { securityHistory } from "@/lib/db/schema";
import { eq, desc, gte, lt, and } from "drizzle-orm";
import { threatIntel } from "@/lib/fargus/security/threatIntel";

// ⭐ Import the REAL scanner from security.ts
import { runSecurityScan as coreScan } from "@/lib/fargus/security";

// Helper: fetch HTML safely using built-in fetch
async function fetchHtml(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    return await res.text();
  } catch {
    return "";
  }
}

// 1️⃣ Mixed Content Check
function checkMixedContent(html: string): boolean {
  return html.includes("http://");
}

// 2️⃣ Admin Panel Exposure
async function checkAdminExposure(url: string): Promise<boolean> {
  const adminPaths = ["/admin", "/wp-admin", "/login", "/dashboard"];

  for (const path of adminPaths) {
    try {
      const res = await fetch(url + path, { method: "GET" });
      if (res.status < 400) return true;
    } catch {}
  }

  return false;
}

// 3️⃣ Exposed Sensitive Files
async function checkExposedFiles(url: string): Promise<boolean> {
  const sensitiveFiles = [
    "/.env",
    "/.git/",
    "/backup.zip",
    "/backup.sql",
    "/db.sql",
  ];

  for (const file of sensitiveFiles) {
    try {
      const res = await fetch(url + file, { method: "HEAD" });
      if (res.status < 400) return true;
    } catch {}
  }

  return false;
}

// 4️⃣ Security Headers
async function checkSecurityHeaders(url: string) {
  try {
    const res = await fetch(url);

    return {
      csp: res.headers.has("content-security-policy"),
      hsts: res.headers.has("strict-transport-security"),
      xFrame: res.headers.has("x-frame-options"),
      xXss: res.headers.has("x-xss-protection"),
      xContentType: res.headers.has("x-content-type-options"),
    };
  } catch {
    return {
      csp: false,
      hsts: false,
      xFrame: false,
      xXss: false,
      xContentType: false,
    };
  }
}

// 5️⃣ Outdated Libraries (simple HTML scan)
function checkOutdatedLibs(html: string): boolean {
  const outdatedPatterns = [
    "jquery-1.",
    "jquery-2.",
    "bootstrap-3.",
    "react-15.",
    "react-16.",
  ];

  return outdatedPatterns.some((p) => html.includes(p));
}

// 6️⃣ Vulnerable CMS (simple signature scan)
function checkVulnerableCMS(html: string): boolean {
  const cmsPatterns = [
    "wp-content",
    "wp-includes",
    "Joomla",
    "Drupal",
    "Powered by Joomla",
  ];

  return cmsPatterns.some((p) => html.includes(p));
}

// ⭐ Save security history (PostgreSQL, snake_case fields)
async function saveSecurityHistory(domain: string, scanResult: any) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingToday = await db
    .select()
    .from(securityHistory)
    .where(
      and(
        eq(securityHistory.domain, domain),
        gte(securityHistory.scan_date, today)
      )
    )
    .limit(1);

  const previous = await db
    .select()
    .from(securityHistory)
    .where(eq(securityHistory.domain, domain))
    .orderBy(desc(securityHistory.scan_date))
    .limit(1);

  let trend_slope = 0;

  if (previous.length > 0) {
    trend_slope = scanResult.riskScore - previous[0].risk_score;
  }

  if (existingToday.length > 0) {
    await db
      .update(securityHistory)
      .set({
        scan_date: new Date(),
        risk_score: scanResult.riskScore,
        ssl_status: scanResult.sslStatus,
        dns_status: scanResult.dnsStatus,
        header_status: scanResult.headerStatus,
        exposure_count: scanResult.exposureCount,
        malware_flag: scanResult.malwareFlag ? 1 : 0,
        uptime_status: scanResult.uptimeStatus,
        trend_slope,
      } as any)
      .where(eq(securityHistory.id, existingToday[0].id));
  } else {
    await db.insert(securityHistory).values({
      domain,
      scan_date: new Date(),
      risk_score: scanResult.riskScore,
      ssl_status: scanResult.sslStatus,
      dns_status: scanResult.dnsStatus,
      header_status: scanResult.headerStatus,
      exposure_count: scanResult.exposureCount,
      malware_flag: scanResult.malwareFlag ? 1 : 0,
      uptime_status: scanResult.uptimeStatus,
      trend_slope,
    } as any);
  }

  const oneYearAgo = new Date();
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);

  await db
    .delete(securityHistory)
    .where(
      and(
        eq(securityHistory.domain, domain),
        lt(securityHistory.scan_date, oneYearAgo)
      )
    );
}

// ⭐ Main security scan wrapper (this file)
export async function runSecurityScanWrapper(domain: string) {
  const url = domain.startsWith("http") ? domain : `https://${domain}`;

  // ⭐ Call the REAL scanner
  const scanResults = await coreScan(url);

  const html = await fetchHtml(url);

  // ⭐ FIXED: safe guard for union type
  let sslStatus = false;
  if (!("error" in scanResults)) {
    sslStatus = scanResults.sslValid;
  }

  const adminExposed = await checkAdminExposure(url);
  const filesExposed = await checkExposedFiles(url);
  const headers = await checkSecurityHeaders(url);
  const outdatedLibs = checkOutdatedLibs(html);
  const vulnerableCms = checkVulnerableCMS(html);
  const intel: any = await threatIntel(domain);

  const exposureCount =
    (adminExposed ? 1 : 0) +
    (filesExposed ? 1 : 0) +
    (outdatedLibs ? 1 : 0) +
    (vulnerableCms ? 1 : 0);

  const malwareFlag = intel.malware ? 1 : 0;
  const uptimeStatus = intel.uptimeStatus ?? "unknown";

  let riskScore = 100;

  if (!sslStatus) riskScore -= 20;
  if (exposureCount > 0) riskScore -= exposureCount * 10;
  if (!headers.csp || !headers.hsts) riskScore -= 10;
  if (malwareFlag) riskScore -= 30;

  if (riskScore < 0) riskScore = 0;
  if (riskScore > 100) riskScore = 100;

  const scanResult: any = {
    domain,
    riskScore,
    sslStatus,
    dnsStatus: intel.dnsStatus ?? "unknown",
    headerStatus: {
      csp: headers.csp,
      hsts: headers.hsts,
      xFrame: headers.xFrame,
      xXss: headers.xXss,
      xContentType: headers.xContentType,
    },
    exposureCount,
    malwareFlag: malwareFlag === 1,
    uptimeStatus,
  };

  await saveSecurityHistory(domain, scanResult);

  return scanResult;
}
