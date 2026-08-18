// lib/geo/geoUtils.ts

export async function fetchIpInfo(url: string) {
  try {
    const hostname = new URL(url).hostname;

    const res = await fetch(`https://ipapi.co/${hostname}/json/`);
    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export function computeGeoRisk(country: string | null): number {
  if (!country) return 50;

  const highRisk = ["Russia", "China", "Iran", "North Korea"];
  const mediumRisk = ["Brazil", "India", "Turkey"];

  if (highRisk.includes(country)) return 90;
  if (mediumRisk.includes(country)) return 60;

  return 20;
}

export function detectCompliance(country: string | null) {
  return {
    gdpr: country === "United States" ? false : true,
    ccpa: country === "United States",
  };
}
