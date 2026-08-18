// lib/seo/seoScan.ts

import {
  fetchHtml,
  extractTag,
  extractMeta,
  extractCanonical,
  extractHeaders,
  checkRobots,
  checkSitemap,
  estimateSpeed,
  estimateMobile,
} from "./seoUtils";

import { computeSeoScore } from "./seoScore";

export async function runSeoScan(url: string) {
  const html = await fetchHtml(url);

  // If HTML cannot be fetched, return a safe empty SEO object
  if (!html) {
    return {
      title: null,
      description: null,
      canonical: null,
      h1: null,
      h2: [],
      robots: false,
      sitemap: false,
      brokenLinks: 0,
      speedScore: 0,
      mobileScore: 0,
      seoScore: 0,
    };
  }

  // Extract SEO components
  const title = extractTag(html, "title");
  const description = extractMeta(html, "description");
  const canonical = extractCanonical(html);
  const headers = extractHeaders(html);

  // Check robots.txt and sitemap.xml
  const robots = await checkRobots(url);
  const sitemap = await checkSitemap(url);

  // Basic speed and mobile heuristics
  const speedScore = estimateSpeed(html);
  const mobileScore = estimateMobile(html);

  // Compute final SEO score
  const seoScore = computeSeoScore({
    title,
    description,
    h1: headers.h1,
    h2: headers.h2,
    speedScore,
    mobileScore,
    brokenLinks: 0,
  });

  // Final normalized SEO object
  return {
    title,
    description,
    canonical,
    h1: headers.h1,
    h2: headers.h2,
    robots,
    sitemap,
    brokenLinks: 0,
    speedScore,
    mobileScore,
    seoScore,
  };
}
