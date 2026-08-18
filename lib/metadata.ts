export async function fetchMetadata(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
      },
    });

    const statusCode = response.status;
    const html = await response.text();

    // --- TITLE ---
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : null;

    // --- DESCRIPTION ---
    const descMatch = html.match(
      /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i
    );
    const description = descMatch ? descMatch[1] : null;

    // --- FAVICON ---
    const faviconMatch = html.match(
      /<link[^>]+rel=["'](?:shortcut icon|icon)["'][^>]+href=["'](.*?)["']/i
    );
    const favicon = faviconMatch ? faviconMatch[1] : null;

    // --- PLATFORM DETECTION ---
    let platform: string | null = null;
    if (html.includes("wp-content") || html.includes("wp-json")) platform = "WordPress";
    else if (html.includes("shopify")) platform = "Shopify";
    else if (html.includes("wix")) platform = "Wix";
    else if (html.includes("squarespace")) platform = "Squarespace";
    else platform = "Custom";

    // --- TECH STACK DETECTION ---
    const tech: string[] = [];
    if (html.includes("cloudflare")) tech.push("Cloudflare");
    if (html.includes("react")) tech.push("React");
    if (html.includes("next")) tech.push("Next.js");
    if (html.includes("php")) tech.push("PHP");
    if (html.includes("vercel")) tech.push("Vercel");

    return {
      title,
      description,
      favicon,
      platform,
      tech: tech.join(", "),
      statusCode,
    };
  } catch (err) {
    console.error("Metadata extraction failed:", err);
    return {
      title: null,
      description: null,
      favicon: null,
      platform: null,
      tech: null,
      statusCode: null,
    };
  }
}
