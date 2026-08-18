import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_r1KMWIFx5JyV@ep-mute-credit-an12hp25-pooler.c-6.us-east-1.aws.neon.tech/26Scan?sslmode=require&channel_binding=require",
  },
});

