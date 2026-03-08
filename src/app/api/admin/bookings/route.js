import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq, like, desc } from "drizzle-orm";
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

  const data = await db
    .select()
    .from(bookings)
    .where(search ? like(bookings.full_name, `%${search}%`) : undefined)
    .orderBy(desc(bookings.created_at))
    .limit(limit)
    .offset(offset);

  return NextResponse.json(data);
}

/* =========================
   DELETE BOOKING
========================= */

export async function DELETE(req) {
  const { id } = await req.json();

  await db.delete(bookings).where(eq(bookings.id, id));

  return NextResponse.json({ success: true });
}

/* =========================
   EDIT BOOKING
========================= */

export async function PUT(req) {
  const body = await req.json();

  await db.update(bookings).set(body).where(eq(bookings.id, body.id));

  return NextResponse.json({ success: true });
}
