import { db } from "../../db";
import { businessUsers } from "@/drizzle/backup-schema/businessUsers";
import { eq } from "drizzle-orm";

export async function checkUserLimit(locationId: number) {
  const users = await db
    .select()
    .from(businessUsers)
    .where(eq(businessUsers.locationId, locationId));

  if (users.length >= 3) {
    throw new Error("This location already has 3 users.");
  }

  return users.length;
}
