import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID required" },
        { status: 400 },
      );
    }

    await db
      .update(bookings)
      .set({
        payment_status: "Paid",
      })
      .where(eq(bookings.id, id));

    return NextResponse.json({
      success: true,
      message: "Payment marked as Paid",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 },
    );
  }
}
