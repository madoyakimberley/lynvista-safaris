import { NextResponse } from "next/server";

// ==========================
// GET DARAJA ACCESS TOKEN
// ==========================
async function getAccessToken() {
  const consumerKey = process.env.DARAJA_CONSUMER_KEY;
  const consumerSecret = process.env.DARAJA_CONSUMER_SECRET;

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64",
  );

  const response = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    },
  );

  const data = await response.json();
  return data.access_token;
}

// ==========================
// FORMAT TIMESTAMP
// ==========================
function getTimestamp() {
  const now = new Date();

  return (
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0")
  );
}

// ==========================
// FORMAT PHONE NUMBER
// ==========================
function formatPhone(phone = "") {
  let formatted = phone.replace(/\s+/g, "");

  if (formatted.startsWith("0")) {
    formatted = "254" + formatted.slice(1);
  } else if (formatted.startsWith("+")) {
    formatted = formatted.slice(1);
  }

  return formatted;
}

// ==========================
// STK PUSH ROUTE
// ==========================
export async function POST(req) {
  try {
    const { phone, amount, bookingId } = await req.json();

    if (!phone || !amount || !bookingId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const token = await getAccessToken();

    const shortCode = process.env.DARAJA_SHORTCODE;
    const passkey = process.env.DARAJA_PASSKEY;
    const timestamp = getTimestamp();

    const formattedPhone = formatPhone(phone);

    if (!formattedPhone || formattedPhone.length < 12) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 },
      );
    }

    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString(
      "base64",
    );

    // FIX: Append the bookingId directly to your URL parameters
    const callbackUrlWithParams = `${process.env.NEXT_PUBLIC_BASE_URL}/api/daraja/callback?bookingId=${bookingId}`;

    const stkData = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.ceil(Number(amount)),
      PartyA: formattedPhone,
      PartyB: shortCode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrlWithParams,
      AccountReference: `Booking-${bookingId}`,
      TransactionDesc: `Payment for Safari Booking #${bookingId}`,
    };

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkData),
      },
    );

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Daraja Error:", error);

    return NextResponse.json(
      { error: "Failed to initiate STK Push" },
      { status: 500 },
    );
  }
}
