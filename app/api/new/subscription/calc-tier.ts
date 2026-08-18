// S1 — Tier Calculation Module
// This file selects the correct tier row based on locationCount
// It supports 26Scan Monthly, 26Scan Annual, FARGUS Monthly, FARGUS Annual

export type TierRow = {
  first: number;
  last: number;
  unitCost: number;
  productId: string | null;
  priceId: string | null;
};

//
// 26SCAN MONTHLY TIERS
//
const tiers26ScanMonthly: TierRow[] = [
  { first: 1, last: 1, unitCost: 34.99, productId: "prod_UthdAnuV6vo3re", priceId: "price_1TtuE6DFcm24Wdf02misZJ4B" },
  { first: 2, last: 5, unitCost: 74.99, productId: null, priceId: null },
  { first: 6, last: 10, unitCost: 189.00, productId: null, priceId: null },
  { first: 11, last: 20, unitCost: 389.00, productId: null, priceId: null },
  { first: 21, last: 999, unitCost: 789.00, productId: null, priceId: null },
  { first: 1000, last: Infinity, unitCost: 24940.00, productId: null, priceId: null },
];

//
// 26SCAN ANNUAL TIERS
//
const tiers26ScanAnnual: TierRow[] = [
  { first: 1, last: 1, unitCost: 419.88, productId: "prod_UthgX9QWKCUMpa", priceId: "price_1TtuHFDFcm24Wdf0wJwriW9p" },
  { first: 2, last: 5, unitCost: 899.99, productId: null, priceId: null },
  { first: 6, last: 10, unitCost: 2799.00, productId: null, priceId: null },
  { first: 11, last: 20, unitCost: 5228.00, productId: null, priceId: null },
  { first: 21, last: 999, unitCost: 11988.00, productId: null, priceId: null },
  { first: 1000, last: Infinity, unitCost: 19940.00, productId: null, priceId: null },
];

//
// FARGUS MONTHLY TIERS
//
const tiersFargusMonthly: TierRow[] = [
  { first: 1, last: 1, unitCost: 9.99, productId: "prod_Uw2GCrVcZQXvGS", priceId: "price_1TwACHDFcm24Wdf0bjfIkwGP" },
  { first: 2, last: 5, unitCost: 19.99, productId: null, priceId: null },
  { first: 6, last: 10, unitCost: 39.99, productId: null, priceId: null },
  { first: 11, last: 20, unitCost: 79.99, productId: null, priceId: null },
  { first: 21, last: 999, unitCost: 149.00, productId: null, priceId: null },
  { first: 1000, last: Infinity, unitCost: 199.00, productId: null, priceId: null },
];

//
// FARGUS ANNUAL TIERS
//
const tiersFargusAnnual: TierRow[] = [
  { first: 1, last: 1, unitCost: 95, productId: "prod_Uw2qiXIsd64BRW", priceId: "price_1TwAklDFcm24Wdf0c0A6phQR" },
  { first: 2, last: 5, unitCost: 190, productId: null, priceId: null },
  { first: 6, last: 10, unitCost: 380, productId: null, priceId: null },
  { first: 11, last: 20, unitCost: 760, productId: null, priceId: null },
  { first: 21, last: 999, unitCost: 1490, productId: null, priceId: null },
  { first: 1000, last: Infinity, unitCost: 1999, productId: null, priceId: null },
];

//
// MAIN SELECTOR
//
export function selectTier(
  product: "26scan" | "fargus",
  cycle: "monthly" | "annual",
  locationCount: number
): TierRow {
  let table: TierRow[];

  if (product === "26scan" && cycle === "monthly") table = tiers26ScanMonthly;
  else if (product === "26scan" && cycle === "annual") table = tiers26ScanAnnual;
  else if (product === "fargus" && cycle === "monthly") table = tiersFargusMonthly;
  else table = tiersFargusAnnual;

  return table.find(t => locationCount >= t.first && locationCount <= t.last)!;
}
