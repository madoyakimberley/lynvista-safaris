import { db } from "@/app/db/db";
import { quotes, quoteItems, bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { id, quoted_price, payment_method, items, email, currency } =
      await req.json();

    if (!id || !quoted_price || !email || !currency) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const [quoteResult] = await db.insert(quotes).values({
      booking_id: id,
      total_price: quoted_price.toString(),
      payment_method: payment_method,
    });
    const quoteId = quoteResult.insertId || quoteResult.id;

    if (items?.length > 0) {
      await db.insert(quoteItems).values(
        items.map((item) => ({
          quote_id: quoteId,
          item_name: item.name,
          item_price: parseFloat(item.price) || 0,
        })),
      );
    }

    await db
      .update(bookings)
      .set({
        payment_status: "Quotation Sent",
        quoted_price: quoted_price.toString(),
        payment_method: payment_method,
      })
      .where(eq(bookings.id, id));

    // Dynamic Conversion Logic
    // KES is whole units. USD/EUR are cents (x100).
    const amount =
      currency === "KES"
        ? Math.round(parseFloat(quoted_price))
        : Math.round(parseFloat(quoted_price) * 100);

    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          amount: amount,
          currency: currency,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
          metadata: { bookingId: id, quoteId },
        }),
      },
    );

    const data = await paystackRes.json();
    if (!data.status) throw new Error(data.message);

    await db
      .update(quotes)
      .set({ payment_link: data.data.authorization_url })
      .where(eq(quotes.id, quoteId));

    return NextResponse.json({
      success: true,
      paymentLink: data.data.authorization_url,
    });
  } catch (err) {
    console.error("Quote Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
