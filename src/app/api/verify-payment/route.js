import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;

  if (!reference)
    return NextResponse.redirect(
      `${baseUrl}/booking-error?message=no-reference`,
    );

  try {
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`.trim(),
        },
      },
    );

    const data = await paystackRes.json();
    if (data.status && data.data.status === "success") {
      const bookingId = data.data.metadata?.bookingId;
      if (bookingId) {
        await db
          .update(bookings)
          .set({ payment_status: "Paid", payment_reference: reference })
          .where(eq(bookings.id, bookingId));
        return NextResponse.redirect(
          `${baseUrl}/payment-success?id=${bookingId}`,
        );
      }
      return NextResponse.redirect(
        `${baseUrl}/booking-error?message=missing-metadata`,
      );
    }

    return NextResponse.redirect(
      `${baseUrl}/booking-error?message=payment-failed`,
    );
  } catch (err) {
    return NextResponse.redirect(
      `${baseUrl}/booking-error?message=server-error`,
    );
  }
}
