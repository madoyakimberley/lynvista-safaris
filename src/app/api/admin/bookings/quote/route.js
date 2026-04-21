import { db } from "@/app/db/db";
import { quotes, quoteItems, bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      id,
      quoted_price,
      payment_method,
      items,
      email,
      full_name,
      currency,
    } = body;

    // VALIDATION
    if (!id || !quoted_price || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const bookingId = Number(id);

    // 1. CREATE QUOTE
    const [quoteResult] = await db
      .insert(quotes)
      .values({
        booking_id: bookingId,
        total_price: quoted_price.toString(),
        payment_method: payment_method || "M-Pesa",
      })
      .returning();

    const quoteId = quoteResult?.id;

    if (!quoteId) {
      return NextResponse.json(
        { success: false, error: "Failed to create quote" },
        { status: 500 },
      );
    }

    // 2. INSERT ITEMS
    if (Array.isArray(items) && items.length > 0) {
      await db.insert(quoteItems).values(
        items.map((item) => ({
          quote_id: quoteId,
          item_name: item.name,
          item_price: Number(item.price) || 0,
        })),
      );
    }

    // 3. UPDATE BOOKING
    await db
      .update(bookings)
      .set({
        payment_status: "Quotation Sent",
        quoted_price: quoted_price.toString(),
        payment_method: payment_method || "M-Pesa",
      })
      .where(eq(bookings.id, bookingId));

    // 4. PAYMENT INSTRUCTIONS
    let instructions = "";

    if (payment_method === "M-Pesa") {
      instructions =
        "Lipa na M-PESA Till Number: <strong>123456</strong><br/>Account: Lynvista Safaris";
    } else if (payment_method === "Card") {
      instructions =
        "Pay securely using your card via our secure payment link (sent separately).";
    } else {
      instructions =
        "Bank Transfer:<br/>Bank: KCB Bank<br/>Account: 987654321<br/>Name: Lynvista Safaris Ltd";
    }

    // 5. EMAIL TEMPLATE (USES YOUR DARK SAFARI THEME)
    const mailOptions = {
      from: `"Lynvista Safaris" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Safari Quotation - Booking #${id}`,
      html: `
        <div style="background-color:#2d1b0b;padding:40px;font-family:Georgia,serif;color:#faf8f3">
          <div style="max-width:600px;margin:auto;background:#1a1008;border:1px solid #fbbf24;border-radius:12px;overflow:hidden">

            <div style="background:#fbbf24;padding:20px;text-align:center">
              <h1 style="margin:0;color:#2d1b0b;letter-spacing:2px">
                LYNVISTA SAFARIS
              </h1>
            </div>

            <div style="padding:30px">
              <h2 style="color:#fbbf24;margin-bottom:10px">
                Jambo ${full_name || "Traveler"},
              </h2>

              <p style="line-height:1.6;color:#faf8f3">
                Your personalized safari quotation is ready.
              </p>

              <div style="margin:20px 0;padding:20px;border:1px solid #5c3d2e;border-radius:10px;text-align:center">
                <p style="font-size:12px;color:#fbbf24">TOTAL QUOTE</p>
                <h2 style="margin:0;color:#faf8f3">
                  ${currency} ${Number(quoted_price).toLocaleString()}
                </h2>
              </div>

              <div style="background:#2d1b0b;padding:15px;border-radius:10px;margin-bottom:20px">
                <h4 style="color:#fbbf24;margin-bottom:8px">Payment Instructions</h4>
                <p style="margin:0;font-size:14px;line-height:1.6">
                  ${instructions}
                </p>
              </div>

              <p style="font-size:12px;color:#d1bfa7">
                Please reply to this email once payment is made for confirmation.
              </p>

              <div style="text-align:center;margin-top:25px">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${id}"
                   style="background:#fbbf24;color:#2d1b0b;padding:12px 25px;border-radius:8px;text-decoration:none;font-weight:bold">
                  View Booking
                </a>
              </div>
            </div>

            <div style="text-align:center;padding:15px;font-size:11px;color:#5c3d2e;background:#120a05">
              © ${new Date().getFullYear()} Lynvista Safaris • Nairobi, Kenya
            </div>

          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // 6. RESPONSE
    return NextResponse.json({
      success: true,
      message: "Quote created & email sent successfully",
      data: {
        quoteId,
        bookingId,
      },
    });
  } catch (err) {
    console.error("QUOTE API ERROR:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
