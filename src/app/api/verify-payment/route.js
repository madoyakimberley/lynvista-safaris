import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  try {
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      },
    );
    const data = await paystackRes.json();

    if (data.status && data.data.status === "success") {
      await db
        .update(bookings)
        .set({ payment_status: "Paid" })
        .where(eq(bookings.id, data.data.metadata.bookingId));
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 400 });
  } catch (err) {
    console.error("Verify Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
