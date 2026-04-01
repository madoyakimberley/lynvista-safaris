import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

// ================= EMAIL FUNCTION =================
async function sendBookingEmail({
  recipientEmail,
  items = [],
  totalPrice,
  currency,
  paymentLink,
}) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // MUST be App Password
    },
  });

  const htmlItems = items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px;border:1px solid #ddd;">${i.name}</td>
          <td style="padding:8px;border:1px solid #ddd;">
            ${Number(i.price || 0).toFixed(2)} ${currency}
          </td>
        </tr>`,
    )
    .join("");

  const mailOptions = {
    from: `"Lynvista Safaris" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: "Booking Confirmation & Payment Link",
    html: `
      <div style="font-family:sans-serif;max-width:600px;padding:20px;border:1px solid #eee;">
        <h2 style="color:#c4a47c;">Confirm Your Booking</h2>

        <table style="width:100%;border-collapse:collapse;">
          <tbody>${htmlItems}</tbody>
        </table>

        <p><strong>Total: ${Number(totalPrice).toFixed(2)} ${currency}</strong></p>

        <a href="${paymentLink}" 
          style="background:#c4a47c;color:#fff;padding:14px 28px;
          text-decoration:none;border-radius:8px;display:inline-block;">
          Pay Now
        </a>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// ================= API =================
export async function POST(req) {
  try {
    const body = await req.json();

    const { id, price, quoted_price, items, email } = body;

    const finalPrice = Number(price || quoted_price);

    // 🔒 VALIDATIONS
    if (!process.env.PAYSTACK_SECRET_KEY) {
      throw new Error("Missing Paystack Secret Key");
    }

    if (!email || isNaN(finalPrice) || finalPrice <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid email and price required" },
        { status: 400 },
      );
    }

    // ⚠️ PAYSTACK DOES NOT SUPPORT KES
    // Use NGN or USD
    const currency = "USD";

    // ================= PAYSTACK =================
    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: Math.round(finalPrice * 100),
          currency,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
          metadata: {
            bookingId: id,
          },
        }),
      },
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status || !paystackData.data) {
      console.error("Paystack Error:", paystackData);
      return NextResponse.json(
        {
          success: false,
          error: paystackData.message || "Payment init failed",
        },
        { status: 400 },
      );
    }

    const paymentLink = paystackData.data.authorization_url;

    // ================= EMAIL =================
    await sendBookingEmail({
      recipientEmail: email,
      items,
      totalPrice: finalPrice,
      currency,
      paymentLink,
    });

    // ================= DB =================
    await db
      .update(bookings)
      .set({ payment_status: "Awaiting Payment" })
      .where(eq(bookings.id, Number(id)));

    return NextResponse.json({
      success: true,
      paymentLink,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
