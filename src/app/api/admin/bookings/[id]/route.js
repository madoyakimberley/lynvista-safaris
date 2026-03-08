import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID required" },
        { status: 400 },
      );
    }

    await db.delete(bookings).where(eq(bookings.id, Number(id)));

    return NextResponse.json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete booking error:", error);

    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 },
    );
  }
}
