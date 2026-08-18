import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  try {
    // Fetch active products
    const products = await stripe.products.list({
      active: true,
      limit: 100
    });

    // Fetch active prices (expand tiers)
    const prices = await stripe.prices.list({
      active: true,
      limit: 100,
      expand: ["data.tiers"]
    });

    // Build clean response
    const formatted = products.data.map(product => {
      const productPrices = prices.data.filter(
        price => price.product === product.id
      );

      return {
        product_id: product.id,
        name: product.name,
        description: product.description,
        prices: productPrices.map(price => ({
          price_id: price.id,
          currency: price.currency,
          interval: price.recurring?.interval ?? null,
          amount: price.unit_amount ? price.unit_amount / 100 : null,
          tiers: price.tiers ?? null
        }))
      };
    });

    return NextResponse.json({
      ok: true,
      products: formatted
    });

  } catch (error) {
    console.error("Stripe products loader error:", error);
    return NextResponse.json(
      { error: "Failed to load Stripe products" },
      { status: 500 }
    );
  }
}
