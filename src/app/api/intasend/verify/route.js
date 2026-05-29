import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { bookingId, invoiceId, trackingId } = await req.json();

    if (!bookingId || !trackingId) {
      return NextResponse.json(
        { error: "Missing required tracking hashes." },
        { status: 400 },
      );
    }

    // 1. Query IntaSend's Status Endpoint to check legitimacy
    const intasendSecret = process.env.INTASEND_SECRET_KEY;
    const isLive = process.env.INTASEND_IS_LIVE === "true";

    const baseUrl = isLive
      ? "https://payment.intasend.com/api/v1/payment/status/"
      : "https://sandbox.intasend.com/api/v1/payment/status/";

    const verifyResponse = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${intasendSecret}`,
      },
      body: JSON.stringify({ invoice_id: invoiceId, tracking_id: trackingId }),
    });

    const verifyData = await verifyResponse.json();
    const paymentState = verifyData?.invoice?.state;

    // 2. Process record modifications if state matches "COMPLETE" matching rules
    if (paymentState === "COMPLETE") {
      await db
        .update(bookings)
        .set({
          payment_status: "Paid",
          payment_reference: trackingId, // Use IntaSend's tracking fingerprint
        })
        .where(eq(bookings.id, Number(bookingId)));

      console.log(
        `✅ CARD APPROVED | Booking Reference Match: ${bookingId} | Key: ${trackingId}`,
      );
      return NextResponse.json({
        success: true,
        message: "Transaction processed successfully.",
      });
    } else {
      console.warn(`⚠️ Unconfirmed IntaSend State Received: ${paymentState}`);
      return NextResponse.json(
        { success: false, error: "Payment verification failed." },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("IntaSend Verify Core Exception Routing Error:", error);
    return NextResponse.json(
      { error: "Internal Gateway Error" },
      { status: 500 },
    );
  }
}
