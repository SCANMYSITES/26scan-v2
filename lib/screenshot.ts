import { chromium } from "playwright";

export async function generateScreenshot(url: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Try normal navigation first
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
  } catch (err) {
    console.error("Navigation failed on first attempt:", err);

    // Retry with realistic browser headers
    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    });

    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
    } catch (err2) {
      console.error("Navigation failed on retry:", err2);

      // Final fallback: return null screenshot but allow scan to continue
      await browser.close();
      return null;
    }
  }

  const buffer = await page.screenshot({ fullPage: true });
  await browser.close();
  return buffer.toString("base64");
}
