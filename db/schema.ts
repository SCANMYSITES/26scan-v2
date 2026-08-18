import { 
  pgTable, 
  text, 
  integer, 
  timestamp, 
  uuid, 
  jsonb,
  serial,
  boolean, 
} from "drizzle-orm/pg-core";

//
// WEBSITES TABLE
//
export const websites = pgTable("websites", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id").notNull(),
  url: text("url").notNull(),
  security: jsonb("security"),
  previousSecurity: jsonb("previous_security"),
  pii: jsonb("pii"),
  title: text("title"),
  description: text("description"),
  favicon: text("favicon"),
  platform: text("platform"),
  tech: text("tech"),

  statusCode: integer("status_code"),
  screenshot: text("screenshot"),
  fargusScore: integer("fargusScore"),

  // ⭐ SECURITY MODULE FIELDS
  securityScore: integer("security_score"),
  securityRiskLevel: text("security_risk_level"),
  securityFindings: text("security_findings"),

  createdAt: timestamp("created_at").defaultNow(),
});

//
// USERS TABLE
//
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),

  phone: text("phone"),

billingCycle: text("billing_cycle"),
locationCount: integer("location_count"),
includeFargus: boolean("include_fargus"),
stripePriceId: text("stripe_price_id"),
 
smsCode: text("sms_code"),


  // ⭐ individual | business
  accountType: text("account_type").notNull().default("individual"),

  //
  // ⭐ INDIVIDUAL PROFILE FIELDS (Step 7A)
  //
  firstName: text("first_name"),
  lastName: text("last_name"),
  address: text("address"),
  zip: text("zip"),
  initialWebsite: text("initial_website"),

  //
  // ⭐ BUSINESS PROFILE FIELDS (Step 7B)
  //
  businessName: text("business_name"),
  businessAddress: text("business_address"),
  businessZip: text("business_zip"),
  businessWebsite: text("business_website"),
  businessPhone: text("business_phone"),
  industry: text("industry"),

  last2faAt: timestamp("last_2fa_at", { withTimezone: true }),

  termsAcceptedAt: timestamp("terms_accepted_at", { withTimezone: true }),
  privacyAcceptedAt: timestamp("privacy_accepted_at", { withTimezone: true }),

  subscriptionPlan: text("subscription_plan"),

  verificationToken: text("verification_token"),
  resetCode: text("reset_code"),
  resetCodeExpires: integer("reset_code_expires"),
  isVerified: boolean("is_verified").default(false).notNull(),

  stripeCustomerId: text("stripe_customer_id"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  // ⭐ profile completion flags
  profileCompleted: integer("profile_completed").default(0),
  profileCompletedAt: timestamp("profile_completed_at"),

  // You already had this — keeping it
  fullName: text("full_name"),

  subscriptionStatus: text("subscription_status").default("active").notNull(),
  trial_end: integer("trial_end"),

});

//
// PASSWORD RESET CODES
//
export const passwordResetCodes = pgTable("password_reset_codes", {
  id: serial("id").primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  code: text("code").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

//
// VERIFICATION CODES
//
export const verificationCodes = pgTable("verification_codes", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  code: text("code").notNull(),
  method: text("method").notNull(),
  type: text("type").notNull(),

  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});


//
// SECURITY HISTORY
//
export const securityHistory = pgTable("security_history", {
  id: uuid("id").defaultRandom().primaryKey(),

  domain: text("domain").notNull(),
  scan_date: timestamp("scan_date").notNull(),
  risk_score: integer("risk_score").notNull(),

  ssl_status: text("ssl_status"),
  dns_status: text("dns_status"),
  header_status: text("header_status"),
  exposure_count: integer("exposure_count"),
  malware_flag: integer("malware_flag"),
  uptime_status: text("uptime_status"),

  trend_slope: integer("trend_slope"),
});

export const fargusEvents = pgTable("fargus_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


