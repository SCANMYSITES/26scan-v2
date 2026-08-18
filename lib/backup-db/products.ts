import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),

  stripeProductId: text("stripe_product_id").notNull(),
  stripePriceId: text("stripe_price_id").notNull(),

  name: text("name").notNull(),
  description: text("description"),

  interval: text("interval").notNull(),        // "month" or "year"
  amount: integer("amount").notNull(),         // price in cents
  currency: text("currency").notNull(),        // "usd"
});
