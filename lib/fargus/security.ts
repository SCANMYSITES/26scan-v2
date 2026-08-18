// lib/fargus/security.ts
import axios from "axios";
import * as cheerio from "cheerio";

export async function runSecurityScan(url: string) {
  const results = {
    sslValid: false,
    mixedContent: false,
    exposedAdminPanels: [],
    exposedSensitiveFiles: [],
    missingSecurityHeaders: [],
    outdatedLibraries: [],
    corsIssues: false,
  };

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      validateStatus: () => true,
    });

    // ---------------------------
    // SSL VALIDATION
    // ---------------------------
    try {
      const httpsCheck = await axios.get(url, { httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }) });
      const cert = httpsCheck.request.socket.getPeerCertificate();
      results.sslValid = Boolean(cert && cert.valid_to);
    } catch {
      results.sslValid = false;
    }

    // ---------------------------
    // MIXED CONTENT CHECK
    // ---------------------------
    const $ = cheerio.load(response.data);
    const insecureAssets = $('script[src^="http://"], img[src^="http://"], link[href^="http://"]');
    results.mixedContent = insecureAssets.length > 0;

    // ---------------------------
    // EXPOSED ADMIN PANELS
    // ---------------------------
    const adminPaths = ["/admin", "/wp-admin", "/dashboard", "/login"];
    for (const path of adminPaths) {
      try {
        const check = await axios.get(url + path, { validateStatus: () => true });
        if (check.status < 400) {
          results.exposedAdminPanels.push(path);
        }
      } catch {}
    }

    // ---------------------------
    // EXPOSED SENSITIVE FILES
    // ---------------------------
    const sensitiveFiles = ["/.env", "/.git/", "/backup.zip", "/db.sql"];
    for (const file of sensitiveFiles) {
      try {
        const check = await axios.get(url + file, { validateStatus: () => true });
        if (check.status < 400) {
          results.exposedSensitiveFiles.push(file);
        }
      } catch {}
    }

    // ---------------------------
    // SECURITY HEADERS
    // ---------------------------
    const requiredHeaders = [
      "strict-transport-security",
      "x-frame-options",
      "content-security-policy",
      "x-xss-protection",
      "x-content-type-options",
    ];

    for (const header of requiredHeaders) {
      if (!response.headers[header]) {
        results.missingSecurityHeaders.push(header);
      }
    }

    // ---------------------------
    // OUTDATED LIBRARIES
    // ---------------------------
    const scripts = $("script[src]");
    scripts.each((_, el) => {
      const src = $(el).attr("src") || "";
      if (src.includes("jquery-1.") || src.includes("bootstrap-3.") || src.includes("react-15.")) {
        results.outdatedLibraries.push(src);
      }
    });

    // ---------------------------
    // CORS CHECK
    // ---------------------------
    if (!response.headers["access-control-allow-origin"]) {
      results.corsIssues = true;
    }

    return results;
  } catch (err) {
    return { error: "Security scan failed", details: err };
  }
}
