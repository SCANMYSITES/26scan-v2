import { 
  pgTable, 
  text, 
  integer, 
  timestamp, 
  uuid 
} from "drizzle-orm/pg-core";

import { users } from "../schema";   // correct path to your users table

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),

  status: text("status").notNull(), // active, trialing, past_due, canceled, etc.

  // ⭐ Added fields required by your webhook
  billingCycle: text("billing_cycle"),          // monthly / annual
  locationCount: integer("location_count"),     // number of locations
  includeFargus: integer("include_fargus"),     // boolean stored as 0/1

  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true })
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
