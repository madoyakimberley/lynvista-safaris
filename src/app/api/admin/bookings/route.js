import { db } from "@/app/db/db";
import { bookings, quotes, quoteItems } from "@/app/db/schema";
import { eq, like, desc, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/* ---------------- EMAIL TRANSPORT ---------------- */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ---------------- GET BOOKINGS ---------------- */
export async function GET(req) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const filters = search
      ? or(
          like(bookings.full_name, `%${search}%`),
          like(bookings.email, `%${search}%`),
        )
      : undefined;

    const data = await db
      .select()
      .from(bookings)
      .where(filters)
      .orderBy(desc(bookings.created_at));

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ---------------- POST ACTIONS ---------------- */
export async function POST(req) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();

    const { action, id, quoted_price, items, email, currency, payment_method } =
      body;

    /* ---------------- MARK AS PAID ---------------- */
    if (action === "mark-paid") {
      await db
        .update(bookings)
        .set({ payment_status: "Paid" })
        .where(eq(bookings.id, Number(id)));

      return NextResponse.json({ success: true });
    }

    /* ---------------- QUOTE FLOW ---------------- */
    if (action === "quote") {
      if (!id || !quoted_price || !email) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }

      const bookingId = Number(id);

      /* ---------------- CREATE QUOTE ---------------- */
      const insertResult = await db.insert(quotes).values({
        booking_id: bookingId,
        total_price: quoted_price.toString(),
        payment_method: payment_method || "M-Pesa",
      });

      // FIX: get ID safely (Drizzle MySQL/Postgres safe fallback)
      const quoteId =
        insertResult?.insertId ||
        insertResult?.[0]?.insertId ||
        insertResult?.[0]?.id;

      if (!quoteId) {
        throw new Error("Failed to create quote (no ID returned)");
      }

      /* ---------------- QUOTE ITEMS ---------------- */
      if (Array.isArray(items) && items.length > 0) {
        await db.insert(quoteItems).values(
          items.map((i) => ({
            quote_id: quoteId,
            item_name: i.name,
            item_price: Number(i.price) || 0,
          })),
        );
      }

      /* ---------------- UPDATE BOOKING ---------------- */
      await db
        .update(bookings)
        .set({
          payment_status: "Quotation Sent",
          quoted_price: quoted_price.toString(),
          payment_method: payment_method || "M-Pesa",
        })
        .where(eq(bookings.id, bookingId));

      /* ---------------- PAYMENT INSTRUCTIONS ---------------- */
      let instructions = "";

      switch (payment_method) {
        case "M-Pesa":
          instructions = "Lipa na M-PESA Till: <strong>123456</strong>";
          break;
        case "Card":
          instructions = "Pay via Card (manual processing)";
          break;
        default:
          instructions =
            "Bank Transfer: <strong>KCB Bank | Acc: 987654321</strong>";
      }

      /* ---------------- EMAIL ---------------- */
      await transporter.sendMail({
        from: `"Lynvista Safaris" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Travel Quotation: Booking #${id}`,
        html: `
          <div style="background:#2d1b0b;padding:40px;font-family:serif;color:#faf8f3;border-radius:12px;">
            <h1 style="color:#fbbf24;">LYNVISTA SAFARIS</h1>

            <p>
              Your custom quote is ready: 
              <strong style="font-size:20px;">
                ${currency || "USD"} ${Number(quoted_price).toLocaleString()}
              </strong>
            </p>

            <div style="background:#3d2a1a;padding:20px;border-radius:8px;margin-top:20px;">
              <h3 style="color:#fbbf24;">Payment Instructions</h3>
              <p>${instructions}</p>
            </div>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        quoteId,
        message: "Quote sent successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("QUOTE ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
