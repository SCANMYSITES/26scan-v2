import { db } from "@/db/db";
import { fargusEvents } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const latest = await db
      .select()
      .from(fargusEvents)
      .orderBy(desc(fargusEvents.id))
      .limit(1);

    if (!latest || latest.length === 0) {
      return Response.json({ message: "No FARGUS events yet." });
    }

    return Response.json(latest[0]);
  } catch (err) {
    return Response.json(
      { error: "FARGUS status error", details: String(err) },
      { status: 500 }
    );
  }
}
