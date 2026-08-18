import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = new Pool({ connectionString: process.env.DATABASE_URL! });

export const db = drizzle(sql, { schema });
