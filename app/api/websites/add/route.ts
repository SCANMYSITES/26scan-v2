import { NextResponse } from "next/server";
import { db } from "@/db/db";
import { websites } from "@/db/schema";

export async function POST(req: Request) {
  try {
    // 1. Get authenticated user using your REAL auth system
    const authRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`, {
      headers: {
        cookie: req.headers.get("cookie") || ""
      }
    });

    const authData = await authRes.json();

    if (!authData.ok || !authData.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = authData.user.id; // UUID from your schema

    // 2. Parse incoming JSON
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      );
    }

    // 3. Insert website into DB
    await db.insert(websites).values({
      userId,
      url,
    });

    return NextResponse.json(
      { message: "Website added successfully" },
      { status: 200 }
    );

  } catch (err) {
    console.error("Add website error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
