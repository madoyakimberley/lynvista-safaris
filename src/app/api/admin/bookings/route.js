import { db } from "@/app/db/db";
import { bookings, quotes, quoteItems } from "@/app/db/schema";
import { eq, like, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com", // Fixed: changed to the correct SMTP host
  port: 465,
  secure: true,
  auth: {
    user: "resend", // Keep this exactly as 'resend'
    pass: process.env.RESEND_API_KEY,
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
      .orderBy(sql`${bookings.created_at} DESC`);

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* ---------------- POST ACTIONS (Update/Quote) ---------------- */
export async function POST(req) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const {
      action,
      id,
      quoted_price,
      items,
      email,
      currency,
      payment_method,
      managed_status,
      payment_status,
    } = body;

    // 1. Update Managed Status
    if (action === "update-status") {
      await db
        .update(bookings)
        .set({ managed_status })
        .where(eq(bookings.id, Number(id)));
      return NextResponse.json({ success: true });
    }

    // 2. Update Payment Status
    if (action === "update-payment") {
      await db
        .update(bookings)
        .set({ payment_status })
        .where(eq(bookings.id, Number(id)));
      return NextResponse.json({ success: true });
    }

    // 3. Mark Paid Action
    if (action === "mark-paid") {
      await db
        .update(bookings)
        .set({ payment_status: "Paid" })
        .where(eq(bookings.id, Number(id)));
      return NextResponse.json({ success: true });
    }

    // 4. Quote Flow
    if (action === "quote") {
      const bookingId = Number(id);
      const insertResult = await db.insert(quotes).values({
        booking_id: bookingId,
        total_price: quoted_price.toString(),
        payment_method: payment_method || "M-Pesa",
      });

      const quoteId =
        insertResult?.insertId ||
        insertResult?.[0]?.insertId ||
        insertResult?.[0]?.id;

      if (Array.isArray(items)) {
        await db.insert(quoteItems).values(
          items.map((i) => ({
            quote_id: quoteId,
            item_name: i.name,
            item_price: Number(i.price) || 0,
          })),
        );
      }

      await db
        .update(bookings)
        .set({
          payment_status: "Quotation Sent",
          quoted_price: quoted_price.toString(),
          payment_method: payment_method || "M-Pesa",
        })
        .where(eq(bookings.id, bookingId));

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/* ---------------- DELETE ACTION ---------------- */
export async function DELETE(req) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID required" }, { status: 400 });

    await db.delete(bookings).where(eq(bookings.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
