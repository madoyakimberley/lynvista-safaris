import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-error?reason=no_reference`,
    );
  }

  try {
    console.log(`>>> [VERIFY] Checking reference: ${reference}`);

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`.trim(),
        },
      },
    );

    const result = await paystackRes.json();

    console.log(
      ">>> [PAYSTACK VERIFY RESPONSE]:",
      JSON.stringify(result, null, 2),
    );

    if (!result.status || result.data.status !== "success") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment-error?reason=not_success`,
      );
    }

    const data = result.data;

    /**
     * ===================== EXTRACT =====================
     */
    const bookingId = Number(data.metadata?.bookingId);
    const paidAmount = data.amount; // in kobo (KES * 100)
    const currency = data.currency;

    if (!bookingId) {
      throw new Error("No booking ID in metadata");
    }

    /**
     * ===================== FETCH BOOKING =====================
     */
    const existingBooking = await db.query.bookings.findFirst({
      where: eq(bookings.id, bookingId),
    });

    if (!existingBooking) {
      throw new Error("Booking not found");
    }

    /**
     * ===================== DOUBLE PAYMENT PROTECTION =====================
     */
    if (existingBooking.payment_status === "Paid") {
      console.log(">>> Already paid, skipping update");

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?id=${bookingId}`,
      );
    }

    /**
     * ===================== AMOUNT VALIDATION =====================
     */
    const expectedAmount = Math.round(
      Number(existingBooking.quoted_price) * 100,
    );

    if (paidAmount !== expectedAmount) {
      throw new Error("Amount mismatch - possible fraud");
    }

    /**
     * ===================== UPDATE DB =====================
     */
    await db
      .update(bookings)
      .set({
        payment_status: "Paid",
        paystack_reference: reference,
      })
      .where(eq(bookings.id, bookingId));

    console.log(`>>> [SUCCESS] Booking ${bookingId} marked as PAID.`);

    /**
     * ===================== REDIRECT =====================
     */
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?id=${bookingId}`,
    );
  } catch (err) {
    console.error(">>> [VERIFY ERROR]:", err.message);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment-error?reason=server_error`,
    );
  }
}
