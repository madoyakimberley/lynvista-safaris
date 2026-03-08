import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const { id, status } = await req.json();

    await db
      .update(bookings)
      .set({ payment_status: status })
      .where(eq(bookings.id, id));

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
