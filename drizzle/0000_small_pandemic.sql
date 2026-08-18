CREATE TABLE "fargus_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "security_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain" text NOT NULL,
	"scan_date" timestamp NOT NULL,
	"risk_score" integer NOT NULL,
	"ssl_status" text,
	"dns_status" text,
	"header_status" text,
	"exposure_count" integer,
	"malware_flag" integer,
	"uptime_status" text,
	"trend_slope" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"phone" text,
	"billing_cycle" text,
	"location_count" integer,
	"include_fargus" boolean,
	"stripe_price_id" text,
	"sms_code" text,
	"account_type" text DEFAULT 'individual' NOT NULL,
	"first_name" text,
	"last_name" text,
	"address" text,
	"zip" text,
	"initial_website" text,
	"business_name" text,
	"business_address" text,
	"business_zip" text,
	"business_website" text,
	"business_phone" text,
	"industry" text,
	"last_2fa_at" timestamp with time zone,
	"terms_accepted_at" timestamp with time zone,
	"privacy_accepted_at" timestamp with time zone,
	"subscription_plan" text,
	"verification_token" text,
	"reset_code" text,
	"reset_code_expires" integer,
	"is_verified" boolean DEFAULT false NOT NULL,
	"stripe_customer_id" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"profile_completed" integer DEFAULT 0,
	"profile_completed_at" timestamp,
	"full_name" text,
	"subscription_status" text DEFAULT 'active' NOT NULL,
	"trial_end" integer,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"code" text NOT NULL,
	"method" text NOT NULL,
	"type" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "websites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"url" text NOT NULL,
	"security" jsonb,
	"previous_security" jsonb,
	"pii" jsonb,
	"title" text,
	"description" text,
	"favicon" text,
	"platform" text,
	"tech" text,
	"status_code" integer,
	"screenshot" text,
	"fargusScore" integer,
	"security_score" integer,
	"security_risk_level" text,
	"security_findings" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "password_reset_codes" ADD CONSTRAINT "password_reset_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_codes" ADD CONSTRAINT "verification_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;