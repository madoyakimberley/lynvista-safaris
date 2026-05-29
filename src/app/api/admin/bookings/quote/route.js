import { db } from "@/app/db/db";
import { quotes, quoteItems, bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const VALID_PAYMENT_METHODS = [
  "M-Pesa",
  "Card",
  "Bank Transfer",
  "Cash",
  "Other",
];

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("API RECEIVED PAYMENT METHOD:", body.payment_method);
    const {
      id,
      quoted_price,
      payment_method,
      payment_instructions,
      items,
      email,
      full_name,
      currency,
    } = body;

    if (!id || !quoted_price || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const bookingId = Number(id);
    const price = Number(quoted_price);

    if (isNaN(bookingId) || isNaN(price)) {
      return NextResponse.json(
        { success: false, error: "Invalid booking or price" },
        { status: 400 },
      );
    }

    // 🔥 FIX: Match case-insensitively so "card", "Card", or "CARD" all work perfectly
    const incomingMethod = (payment_method || "")
      .toString()
      .toLowerCase()
      .trim();

    let safePaymentMethod = "M-Pesa";

    if (incomingMethod.includes("card")) {
      safePaymentMethod = "Card";
    } else if (
      incomingMethod.includes("mpesa") ||
      incomingMethod.includes("m-pesa")
    ) {
      safePaymentMethod = "M-Pesa";
    } else if (incomingMethod.includes("bank")) {
      safePaymentMethod = "Bank Transfer";
    } else if (incomingMethod.includes("cash")) {
      safePaymentMethod = "Cash";
    }
    console.log("INCOMING:", payment_method);
    console.log("NORMALIZED:", safePaymentMethod);
    console.log("FINAL CHOSEN METHOD:", safePaymentMethod);

    const methodSlug = safePaymentMethod === "Card" ? "card" : "mpesa";
    const paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/pay/${methodSlug}/${bookingId}`;

    // =========================
    // CREATE QUOTE
    // =========================
    const insertResult = await db.insert(quotes).values({
      booking_id: bookingId,
      total_price: price.toFixed(2),
      payment_method: safePaymentMethod,
      payment_link: paymentUrl,
    });

    const quoteId = insertResult?.[0]?.insertId || insertResult?.insertId;

    if (!quoteId) {
      return NextResponse.json(
        { success: false, error: "Failed to create quote" },
        { status: 500 },
      );
    }

    // =========================
    // QUOTE ITEMS
    // =========================
    if (Array.isArray(items) && items.length > 0) {
      await db.insert(quoteItems).values(
        items.map((item) => ({
          quote_id: quoteId,
          item_name: item.name || "Item",
          item_price: Number(item.price) || 0,
        })),
      );
    }

    // =========================
    // PAYMENT INSTRUCTIONS
    // =========================
    let instructions = (payment_instructions || "").trim();

    if (!instructions) {
      if (safePaymentMethod === "M-Pesa") {
        instructions =
          "Click below to receive an M-Pesa STK push on your phone.";
      } else if (safePaymentMethod === "Card") {
        instructions =
          "You will be redirected to a secure card payment gateway to complete your payment.";
      } else {
        instructions =
          "Bank Transfer Details:\nBank: KCB Bank\nAccount: 987654321\nName: Lynvista Safaris Ltd";
      }
    }

    // =========================
    // UPDATE BOOKING
    // =========================
    await db
      .update(bookings)
      .set({
        payment_status: "Quotation Sent",
        quoted_price: price.toFixed(2),
        payment_method: safePaymentMethod,
        payment_instructions: instructions,
      })
      .where(eq(bookings.id, bookingId));

    // =========================
    // EMAIL
    // =========================
    const mailOptions = {
      from: `"Lynvista Safaris" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Safari Quotation - Booking #${id}`,
      html: `
        <div style="background:#2d1b0b;padding:20px;font-family:Georgia;color:#faf8f3;">
          <div style="max-width:600px;margin:auto;background:#1a1008;border-radius:12px;overflow:hidden;">

            <div style="background:#fbbf24;padding:18px;text-align:center;">
              <h1 style="margin:0;color:#2d1b0b;">LYNVISTA SAFARIS</h1>
            </div>

            <div style="padding:24px;">
              <h2 style="color:#fbbf24;">Jambo ${full_name || "Traveler"},</h2>

              <div style="margin:20px 0;padding:18px;border:1px solid #5c3d2e;border-radius:10px;text-align:center;">
                <p style="font-size:12px;color:#fbbf24;font-weight:bold;">TOTAL</p>
                <h2 style="margin:0;">
                  ${currency || "USD"} ${price.toLocaleString()}
                </h2>
              </div>

              <div style="background:#2d1b0b;padding:15px;border-radius:10px;">
                <h4 style="color:#fbbf24;">Payment Instructions</h4>
                <p style="white-space:pre-line;font-size:14px;">
                  ${instructions}
                </p>
              </div>

              ${
                safePaymentMethod !== "Bank Transfer"
                  ? `
                <div style="text-align:center;margin-top:25px;">
                  <a href="${paymentUrl}"
                     style="background:#fbbf24;color:#2d1b0b;padding:14px 24px;border-radius:8px;font-weight:bold;text-decoration:none;display:inline-block;">
                    Pay Now
                  </a>
                </div>
              `
                  : ""
              }

            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "Quote created & email sent",
      data: { quoteId, bookingId },
    });
  } catch (err) {
    console.error("QUOTE ERROR:", err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
