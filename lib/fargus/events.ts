import { db } from "@/db/db";
import { fargusEvents } from "@/db/schema";

export async function logFargusEvent(eventType: string, message: string) {
  await db.insert(fargusEvents).values({
    eventType,
    message,
  });
}
