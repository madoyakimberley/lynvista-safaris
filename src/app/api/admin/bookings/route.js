import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq, like, desc, or } from "drizzle-orm";
import { NextResponse } from "next/server";

/* =========================
   GET BOOKINGS
   With Search + Pagination
========================= */
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // Added 'or' to allow searching by name OR email for better admin UX
  const data = await db
    .select()
    .from(bookings)
    .where(
      search
        ? or(
            like(bookings.full_name, `%${search}%`),
            like(bookings.email, `%${search}%`),
          )
        : undefined,
    )
    .orderBy(desc(bookings.created_at))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(data);
}

/* =========================
   DELETE BOOKING
========================= */
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await db.delete(bookings).where(eq(bookings.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* =========================
   EDIT BOOKING
========================= */
export async function PUT(req) {
  try {
    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing booking ID" },
        { status: 400 },
      );
    }

    // Clean up numerical values to ensure they are integers for MySQL
    if (updateData.adults) updateData.adults = parseInt(updateData.adults);
    if (updateData.children)
      updateData.children = parseInt(updateData.children);

    await db
      .update(bookings)
      .set(updateData) // id is excluded here to avoid MySQL primary key update errors
      .where(eq(bookings.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
