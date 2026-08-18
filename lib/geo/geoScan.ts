// lib/geo/geoScan.ts

import { fetchIpInfo, computeGeoRisk, detectCompliance } from "./geoUtils";
import { computeGeoScore } from "./geoScore";

export async function runGeoScan(url: string) {
  const info = await fetchIpInfo(url);

  // If GEO lookup fails, return a safe empty GEO object for the user
  if (!info) {
    return {
      country: null,
      region: null,
      city: null,
      asn: null,
      isp: null,
      provider: null,
      riskScore: 50,
      compliance: {
        gdpr: false,
        ccpa: false,
      },
      geoScore: 0,
    };
  }

  const country = info.country_name || null;
  const region = info.region || null;
  const city = info.city || null;
  const asn = info.asn || null;
  const isp = info.org || null;
  const provider = info.org || null;

  const riskScore = computeGeoRisk(country);
  const compliance = detectCompliance(country);

  const geoScore = computeGeoScore({
    riskScore,
    provider,
    country,
  });

  return {
    country,
    region,
    city,
    asn,
    isp,
    provider,
    riskScore,
    compliance,
    geoScore,
  };
}
