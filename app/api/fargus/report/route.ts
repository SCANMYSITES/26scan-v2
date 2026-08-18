import { db } from "@/db/db";
import { fargusEvents } from "@/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(fargusEvents)
      .orderBy(desc(fargusEvents.id));

    return Response.json({
      ok: true,
      report: {
        latest: rows[0] || null,
        history: rows
      }
    });
  } catch (err) {
    return Response.json(
      { ok: false, error: "Unable to load FARGUS report." },
      { status: 500 }
    );
  }
}
