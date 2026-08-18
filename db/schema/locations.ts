import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../schema";   // FIXED: correct path to your users table

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull()
});
