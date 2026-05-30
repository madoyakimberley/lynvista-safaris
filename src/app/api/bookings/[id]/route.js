import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema"; // Ensure this is imported
import { eq } from "drizzle-orm"; // 1. Import 'eq'

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    return NextResponse.json(
      { error: "Booking ID is required" },
      { status: 400 },
    );
  }

  try {
    const cleanId = id.replace(/\D/g, "");

    // 2. Use Drizzle's query builder instead of raw SQL
    // We convert cleanId to a Number because SQL IDs are usually integers
    const rows = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(cleanId)))
      .limit(1);

    const booking = rows[0];

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("Database fetch error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve details" },
      { status: 500 },
    );
  }
}
