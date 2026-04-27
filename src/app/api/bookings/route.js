import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import nodemailer from "nodemailer";

// Setup transporter ONCE outside the request to prevent memory leaks/auth overhead
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.full_name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // MAP FRONTEND VALUES TO SCHEMA ENUMS
    const validCurrencies = ["EUR", "USD", "KES"];
    const submittedCurrency = body.currency?.toUpperCase();
    const finalCurrency = validCurrencies.includes(submittedCurrency)
      ? submittedCurrency
      : "USD";

    const validPaymentMethods = ["Bank Transfer", "M-Pesa", "Cash", "Other"];
    const finalPaymentMethod = validPaymentMethods.includes(body.payment_method)
      ? body.payment_method
      : "Other";

    const cleanedBody = {
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      tour_package: body.tour_package || null,
      currency: finalCurrency,
      payment_method: finalPaymentMethod,
      flight_type:
        body.flight_type === "None" ? null : body.flight_type || null,
      departure_city: body.departure_city || null,
      arrival_city: body.arrival_city || null,
      accommodation_type:
        body.accommodation_type === "None"
          ? null
          : body.accommodation_type || null,
      checkin_date: body.checkin_date || null,
      checkout_date: body.checkout_date || null,
      travel_start_date: body.travel_start_date || null,
      travel_end_date: body.travel_end_date || null,
      adults: parseInt(body.adults) || 1,
      children: parseInt(body.children) || 0,
      quoted_price: body.quoted_price ? String(body.quoted_price) : "0.00",
      notes: body.notes || null,
      payment_reference: body.payment_reference || null,
      managed_status: "Pending",
      payment_status: "Pending",
    };

    // ================= SAVE BOOKING (MySQL Syntax) =================
    // MySQL returns an array where the first item contains metadata like insertId
    const [result] = await db.insert(bookings).values(cleanedBody);

    const newBookingId = result.insertId;

    // ================= EMAIL TEMPLATE =================
    const tour = body.tour_package || "Not specified";
    const startDate = body.travel_start_date || "N/A";
    const endDate = body.travel_end_date || "N/A";
    const travelers = `${body.adults || 1} Adults, ${body.children || 0} Children`;

    const clientEmailTemplate = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 20px; overflow: hidden; background-color: #fdfdfd;">
        <div style="background-color: #3d2b1f; padding: 30px; text-align: center;">
           <h1 style="color: #e5b078; margin: 0; font-family: serif;">LYNVISTA SAFARIS</h1>
           <p style="color: #ffffff; font-size: 14px; margin-top: 5px;">Your Adventure Awaits</p>
        </div>
        <div style="padding: 30px; color: #3d2b1f;">
          <h2>Hello ${body.full_name},</h2>
          <p style="line-height: 1.6;">Thank you for choosing Lynvista Safaris. We have received your booking request.</p>
          <div style="background-color: #f4f1ed; padding: 20px; border-radius: 12px; margin: 25px 0;">
            <p><strong>Tour:</strong> ${tour}</p>
            <p><strong>Dates:</strong> ${startDate} → ${endDate}</p>
            <p><strong>Travelers:</strong> ${travelers}</p>
            <p><strong>Payment Method:</strong> ${finalPaymentMethod}</p>
          </div>
          <p>Warm regards,<br/><strong>The Lynvista Safaris Team</strong></p>
        </div>
      </div>
    `;

    // Send Emails
    await Promise.all([
      transporter.sendMail({
        from: `"Lynvista Safaris" <${process.env.EMAIL_USER}>`,
        to: body.email,
        subject: "🎉 Booking Confirmation - Lynvista Safaris",
        html: clientEmailTemplate,
      }),
      transporter.sendMail({
        from: `"Lynvista System" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: "🚨 New Booking Received",
        html: `<p>New booking from ${body.full_name}. ID: ${newBookingId}</p>`,
      }),
    ]);

    return NextResponse.json({
      success: true,
      bookingId: newBookingId,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
