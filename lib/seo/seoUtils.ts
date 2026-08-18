// lib/seo/seoUtils.ts

export async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export function extractTag(html: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>(.*?)</${tag}>`, "i");
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

export function extractMeta(html: string, name: string): string | null {
  const regex = new RegExp(
    `<meta[^>]*name=["']${name}["'][^>]*content=["'](.*?)["']`,
    "i"
  );
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

export function extractCanonical(html: string): string | null {
  const regex = /<link[^>]*rel=["']canonical["'][^>]*href=["'](.*?)["']/i;
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

export function extractHeaders(html: string): { h1: string | null; h2: string[] } {
  const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  const h2Matches = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)];

  return {
    h1: h1Match ? h1Match[1].trim() : null,
    h2: h2Matches.map((m) => m[1].trim()),
  };
}

export async function checkRobots(url: string): Promise<boolean> {
  try {
    const res = await fetch(`${url}/robots.txt`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function checkSitemap(url: string): Promise<boolean> {
  try {
    const res = await fetch(`${url}/sitemap.xml`);
    return res.ok;
  } catch {
    return false;
  }
}

export function estimateSpeed(html: string): number {
  const size = html.length;
  if (size < 20000) return 90;
  if (size < 50000) return 75;
  if (size < 100000) return 60;
  return 40;
}

export function estimateMobile(html: string): number {
  return html.includes("viewport") ? 90 : 50;
}
