import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // FIX: Safely parse bookingId out from the URL query params layout structure
    const { searchParams } = new URL(req.url);
    const queryBookingId = searchParams.get("bookingId");
    const bookingId = queryBookingId ? Number(queryBookingId) : null;

    const body = await req.json();
    const callback = body?.Body?.stkCallback;

    if (!callback) {
      return NextResponse.json(
        { ResultCode: 1, ResultDesc: "Invalid callback payload" },
        { status: 400 },
      );
    }

    const resultCode = callback.ResultCode;
    const metadata = callback.CallbackMetadata?.Item || [];

    const mpesaReceipt = metadata.find(
      (i) => i.Name === "MpesaReceiptNumber",
    )?.Value;

    const amount = metadata.find((i) => i.Name === "Amount")?.Value;
    const phone = metadata.find((i) => i.Name === "PhoneNumber")?.Value;

    // =========================
    // SUCCESS PAYMENT
    // =========================
    if (resultCode === 0 && bookingId) {
      await db
        .update(bookings)
        .set({
          payment_status: "Paid",
          payment_reference: mpesaReceipt,
        })
        .where(eq(bookings.id, bookingId));

      console.log(
        `✅ PAID | Booking ${bookingId} | Receipt: ${mpesaReceipt} | Amount: ${amount} | Phone: ${phone}`,
      );
    }
    // =========================
    // FAILED PAYMENT
    // =========================
    else if (bookingId) {
      await db
        .update(bookings)
        .set({
          payment_status: "Cancelled",
        })
        .where(eq(bookings.id, bookingId));

      console.log(`❌ FAILED | Booking ${bookingId} | Code: ${resultCode}`);
    } else {
      console.log(
        `⚠️ Callback received but no valid tracking bookingId found in parameters. Code: ${resultCode}`,
      );
    }

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (error) {
    console.error("Callback Error:", error);

    return NextResponse.json(
      {
        ResultCode: 1,
        ResultDesc: "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
