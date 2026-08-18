// Entitlements Engine for Stripe Graduated Tier Pricing

// Tier tables for each Stripe price_id
// ONE price_id contains ALL tier rows

const TIER_TABLE = {
  // 26Scan Monthly
  "price_1TtuE6DFcm24Wdf02misZJ4B": {
    product_id: "prod_UthdAnuV6vo3re",
    description: "26Scan Monthly",
    interval: "monthly",
    tiers: [
      { first: 1, last: 1, amount: 34.99 },
      { first: 2, last: 5, amount: 74.99 },
      { first: 6, last: 10, amount: 189.00 },
      { first: 11, last: 20, amount: 389.00 },
      { first: 21, last: 999, amount: 789.00 },
      { first: 1000, last: Infinity, amount: 24940.00 }
    ]
  },

  // 26Scan Annual
  "price_1TtuHFDFcm24Wdf0wJwriW9p": {
    product_id: "prod_UthgX9QWKCUMpa",
    description: "26Scan Annual",
    interval: "annual",
    tiers: [
      { first: 1, last: 1, amount: 419.88 },
      { first: 2, last: 5, amount: 899.99 },
      { first: 6, last: 10, amount: 2799.00 },
      { first: 11, last: 20, amount: 5228.00 },
      { first: 21, last: 999, amount: 11988.00 },
      { first: 1000, last: Infinity, amount: 19940.00 }
    ]
  },

  // FARGUS Monthly
  "price_1TwACHDFcm24Wdf0bjfIkwGP": {
    product_id: "prod_Uw2GCrVcZQXvGS",
    description: "FARGUS Intelligence Monthly",
    interval: "monthly",
    tiers: [
      { first: 1, last: 1, amount: 9.99 },
      { first: 2, last: 5, amount: 19.99 },
      { first: 6, last: 10, amount: 39.99 },
      { first: 11, last: 20, amount: 79.99 },
      { first: 21, last: 999, amount: 149.00 },
      { first: 1000, last: Infinity, amount: 199.00 }
    ]
  },

  // FARGUS Annual
  "price_1TwAklDFcm24Wdf0c0A6phQR": {
    product_id: "prod_Uw2qiXIsd64BRW",
    description: "FARGUS Intelligence Annual",
    interval: "annual",
    tiers: [
      { first: 1, last: 1, amount: 95 },
      { first: 2, last: 5, amount: 190 },
      { first: 6, last: 10, amount: 380 },
      { first: 11, last: 20, amount: 760 },
      { first: 21, last: 999, amount: 1490 },
      { first: 1000, last: Infinity, amount: 1999 }
    ]
  }
};

// Compute entitlements based on price_id + locationCount
export function computeEntitlements(priceId: string, locationCount: number) {
  const product = TIER_TABLE[priceId];

  if (!product) {
    return {
      error: "Unknown price_id",
      price_id: priceId
    };
  }

  // Find correct tier based on locationCount
  const tier = product.tiers.find(t => 
    locationCount >= t.first && locationCount <= t.last
  );

  if (!tier) {
    return {
      error: "Location count exceeds all tiers",
      price_id: priceId,
      locationCount
    };
  }

  return {
    product_id: product.product_id,
    price_id: priceId,
    tier: {
      first: tier.first,
      last: tier.last
    },
    max_locations: tier.last,
    amount: tier.amount,
    interval: product.interval,
    description: product.description
  };
}
