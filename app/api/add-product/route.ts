// /app/api/add-product/route.ts

import { NextResponse } from "next/server";
import { products } from "@/lib/backup-db/products";
import { db } from "@/lib/backup-db";
import { users, userProducts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  // 1) Read session cookie
  const cookieHeader = req.headers.get("cookie");
  const sessionEmail = cookieHeader
    ?.split(";")
    ?.find((c) => c.trim().startsWith("sessionEmail="))
    ?.split("=")[1];

  if (!sessionEmail) {
    return NextResponse.redirect("/login");
  }

  // 2) Look up user by email
  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.email, decodeURIComponent(sessionEmail)));

  if (userRows.length === 0) {
    return NextResponse.redirect("/login");
  }

  const user = userRows[0];

  // 3) Get product ID from query
  const url = new URL(req.url);
  const productId = url.searchParams.get("id");

  if (!productId) {
    return NextResponse.json(
      { error: "Missing product ID" },
      { status: 400 }
    );
  }

  // 4) Validate product exists (DB lookup)
  const productRows = await db
    .select()
    .from(products)
    .where(eq(products.stripeProductId, productId));

  const product = productRows[0];

  if (!product) {
    return NextResponse.json(
      { error: "Invalid product ID" },
      { status: 404 }
    );
  }

  // 5) Check if user already selected this product
  const existing = await db
    .select()
    .from(userProducts)
    .where(
      and(
        eq(userProducts.userId, user.id),
        eq(userProducts.productId, productId)
      )
    );

  if (existing.length > 0) {
    return NextResponse.redirect("/dashboard");
  }

  // 6) Store product selection
  await db.insert(userProducts).values({
    userId: user.id,
    productId,
    productName: product.name,
    createdAt: new Date(),
  });

  // 7) Route based on accountType
  if (user.accountType === "Business") {
    return NextResponse.redirect("/business-dashboard");
  }

  return NextResponse.redirect("/individual-dashboard");
}
