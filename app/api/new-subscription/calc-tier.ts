export function selectTier(options: {
  billingCycle: string;
  locationCount: number;
  includeFargus: boolean;
}) {
  const { billingCycle, locationCount, includeFargus } = options;

  // TEMP LOGIC — replace with your real pricing later
  const priceId =
    billingCycle === "annual"
      ? "price_annual_123"
      : "price_monthly_123";

  return {
    priceId,
    billingCycle,
    locationCount,
    includeFargus,
  };
}

export {};
