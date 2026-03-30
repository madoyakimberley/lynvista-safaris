import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import { db } from "@/app/db/db";
import { bookings, quotes, quoteItems } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * ===================== EMAIL FUNCTION =====================
 */
async function sendQuotationEmail({
  recipientEmail,
  items = [],
  totalPrice,
  currency,
  paymentLink,
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    const htmlItems = items
      .map(
        (i) => `<tr>
          <td style="padding:8px; border:1px solid #ddd;">${i.name || "Service Item"}</td>
          <td style="padding:8px; border:1px solid #ddd;">${Number(i.price || 0).toFixed(2)} ${currency}</td>
        </tr>`,
      )
      .join("");

    await transporter.sendMail({
      from: `"Lynvista Safaris" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: "Your Booking Quotation - Lynvista Safaris",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #c4a47c;">Your Quotation is Ready</h2>
          <p>Please find your booking breakdown below:</p>
          <table style="width: 100%; border-collapse: collapse;"><tbody>${htmlItems}</tbody></table>
          <p style="margin-top: 10px;">
            <strong>Total: ${Number(totalPrice).toFixed(2)} ${currency}</strong>
          </p>
          <div style="margin-top: 20px;">
            <a href="${paymentLink}" style="background:#c4a47c; color:#fff; padding:12px 25px; text-decoration:none; border-radius:5px; display:inline-block;">
              Pay Now via Card / M-Pesa
            </a>
          </div>
        </div>
      `,
    });
    console.log(">>> [SUCCESS] Email sent to:", recipientEmail);
  } catch (err) {
    console.error(">>> [EMAIL ERROR]:", err);
  }
}

/**
 * ===================== MAIN API =====================
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { id, quoted_price, items, email } = body;

    // 1. Validation
    const missingFields = [];
    if (!id) missingFields.push("Booking ID (id)");
    if (!quoted_price) missingFields.push("Quoted Price (quoted_price)");
    if (!email) missingFields.push("Recipient Email (email)");
    if (!items || !Array.isArray(items) || items.length === 0)
      missingFields.push("Service Items (items)");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing fields: ${missingFields.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const bookingId = Number(id);
    const safeEmail = email.trim();

    // 2. Ensure Booking Exists
    const [bookingExists] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);
    if (!bookingExists) {
      return NextResponse.json(
        { success: false, error: "Booking not found." },
        { status: 404 },
      );
    }

    // 3. Paystack Initialization
    const safeCurrency = "KES";
    const amountInCents = Math.round(Number(quoted_price) * 100);

    let paymentLink;
    try {
      const paystackRes = await fetch(
        "https://api.paystack.co/transaction/initialize",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: safeEmail,
            amount: amountInCents,
            currency: safeCurrency,
            metadata: { bookingId },
            callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-payment`,
          }),
        },
      );

      const psData = await paystackRes.json();
      if (!psData.status) throw new Error(psData.message);
      paymentLink = psData.data.authorization_url;
    } catch (err) {
      return NextResponse.json(
        { success: false, error: `Payment Error: ${err.message}` },
        { status: 502 },
      );
    }

    // 4. Database Transaction
    try {
      await db.transaction(async (tx) => {
        // Fix: Properly destructure for mysql2/drizzle result
        const [quoteResult] = await tx.insert(quotes).values({
          booking_id: bookingId,
          total_price: Number(quoted_price) || 0,
          payment_method: "Paystack",
          payment_link: paymentLink,
        });

        const quoteId = quoteResult.insertId;

        // Optimization: Batch insert items instead of a loop
        const itemsToInsert = items.map((item) => ({
          quote_id: quoteId,
          item_name: item.name || "Service Item",
          item_price: Number(item.price || 0),
        }));
        await tx.insert(quoteItems).values(itemsToInsert);

        // Update booking status
        await tx
          .update(bookings)
          .set({
            payment_status: "Quotation Sent",
            quoted_price: Number(quoted_price) || 0,
            payment_method: "Paystack",
            payment_link_sent: "Yes",
          })
          .where(eq(bookings.id, bookingId));
      });
    } catch (dbErr) {
      console.error("DB Transaction failed:", dbErr);
      return NextResponse.json(
        { success: false, error: "Database save failed." },
        { status: 500 },
      );
    }

    // 5. Fire-and-forget Email (Doesn't block the response)
    sendQuotationEmail({
      recipientEmail: safeEmail,
      items,
      totalPrice: quoted_price,
      currency: safeCurrency,
      paymentLink,
    }).catch(console.error);

    return NextResponse.json({ success: true, paymentLink });
  } catch (error) {
    console.error("Critical API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
