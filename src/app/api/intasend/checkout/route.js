import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, currency, email, api_ref } = body;

    const secretKey = process.env.INTASEND_SECRET_KEY;
    const isLive = process.env.INTASEND_IS_LIVE === "true";

    // Safety: Ensure key starts with expected prefix
    if (!secretKey || !secretKey.startsWith("ISSecretKey_")) {
      console.error(
        "INVALID KEY FORMAT: Ensure INTASEND_SECRET_KEY starts with ISSecretKey_",
      );
      return NextResponse.json(
        { message: "Invalid API Configuration" },
        { status: 500 },
      );
    }

    const url = isLive
      ? "https://payment.intasend.com/api/v1/checkout/"
      : "https://sandbox.intasend.com/api/v1/checkout/";

    const payload = {
      amount: Number(amount),
      currency: currency || "KES",
      email: email,
      api_ref: api_ref,
      // Ensure this URL is fully qualified (e.g., https://your-site.com)
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/success`,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        // Use 'Bearer ' + secretKey
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "INTASEND API REJECTED REQUEST:",
        JSON.stringify(data, null, 2),
      );
      return NextResponse.json(
        { message: "Payment init failed", details: data },
        { status: 400 },
      );
    }

    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error("SERVER EXCEPTION:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
