import { db } from "@/db";
import { websites } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response("Missing scan ID", { status: 400 });
    }

    await db.delete(websites).where(eq(websites.id, id));

    return new Response("Scan deleted", { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    return new Response("Server error", { status: 500 });
  }
}
