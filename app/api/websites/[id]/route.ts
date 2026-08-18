import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { websites } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id; // UUID string

    const result = await db
      .select()
      .from(websites)
      .where(eq(websites.id, id));

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Website not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (err) {
    console.error("API /websites/[id] error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
