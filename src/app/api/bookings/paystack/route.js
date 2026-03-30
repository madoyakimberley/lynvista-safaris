import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { success: false, message: "No reference provided" },
      { status: 400 },
    );
  }

  try {
    console.log(`>>> [VERIFY] Checking reference: ${reference}`);

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          // Ensure .trim() to match your working POST handler
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`.trim(),
        },
      },
    );

    const result = await paystackRes.json();
    console.log(
      ">>> [PAYSTACK VERIFY RESPONSE]:",
      JSON.stringify(result, null, 2),
    );

    if (result.status && result.data.status === "success") {
      const bookingId = result.data.metadata?.bookingId;

      if (!bookingId) {
        throw new Error(
          "Payment successful, but no Booking ID found in metadata.",
        );
      }

      // Update the booking status in the DB
      await db
        .update(bookings)
        .set({
          payment_status: "Paid",
          paystack_reference: reference,
        })
        .where(eq(bookings.id, bookingId));

      console.log(`>>> [SUCCESS] Booking ${bookingId} marked as PAID.`);

      // Redirect the user to your success page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?id=${bookingId}`,
      );
    }

    return NextResponse.json(
      { success: false, message: "Payment not verified" },
      { status: 400 },
    );
  } catch (err) {
    console.error(">>> [VERIFY ERROR]:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
