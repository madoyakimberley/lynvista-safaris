import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq, like, desc, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

/* =====================================================
   GET BOOKINGS (with Pagination)
===================================================== */
export async function GET(req) {
  // 1. SECURITY: Block if no token
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return new NextResponse("Unauthorized Access", {
      status: 401,
      headers: { "Content-Type": "text/plain" },
    });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = 10;
    const offset = (page - 1) * limit;

    const filters = search
      ? or(
          like(bookings.full_name, `%${search}%`),
          like(bookings.email, `%${search}%`),
        )
      : undefined;

    // 2. PARALLEL FETCH: Get data and total count at the same time
    const [data, totalCountResult] = await Promise.all([
      db
        .select()
        .from(bookings)
        .where(filters)
        .orderBy(desc(bookings.created_at))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql`count(*)` })
        .from(bookings)
        .where(filters),
    ]);

    const totalItems = Number(totalCountResult[0].count);

    return NextResponse.json({
      data,
      pagination: {
        total: totalItems,
        page,
        limit,
        totalPages: Math.ceil(totalItems / limit),
      },
    });
  } catch (error) {
    console.error("GET Bookings Error:", error);
    return new NextResponse("Unauthorized Access", { status: 401 });
  }
}

/* =====================================================
   DELETE BOOKING
===================================================== */
export async function DELETE(req) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return new NextResponse("Unauthorized Access", { status: 401 });

  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    const result = await db
      .delete(bookings)
      .where(eq(bookings.id, Number(id)))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Unauthorized Access", { status: 401 });
  }
}

/* =====================================================
   UPDATE BOOKING
===================================================== */
export async function PUT(req) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return new NextResponse("Unauthorized Access", { status: 401 });

  try {
    const { id, ...updateData } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    // Sanitize numeric inputs
    if (updateData.adults) updateData.adults = parseInt(updateData.adults);
    if (updateData.children)
      updateData.children = parseInt(updateData.children);
    if (updateData.quoted_price)
      updateData.quoted_price = parseFloat(updateData.quoted_price);

    const updated = await db
      .update(bookings)
      .set(updateData)
      .where(eq(bookings.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error) {
    console.error("PUT Error:", error);
    return new NextResponse("Unauthorized Access", { status: 401 });
  }
}
