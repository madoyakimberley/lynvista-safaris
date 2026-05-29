import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing booking ID" },
        { status: 400 },
      );
    }

    // Only select fields needed for checkout to remain secure
    const results = await db
      .select({
        id: bookings.id,
        quoted_price: bookings.quoted_price,
        currency: bookings.currency,
        payment_status: bookings.payment_status,
      })
      .from(bookings)
      .where(eq(bookings.id, Number(id)))
      .limit(1);

    const foundBooking = results[0];

    if (!foundBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: foundBooking });
  } catch (error) {
    console.error("Public Fetch Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
