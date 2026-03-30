import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.full_name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const cleanedBody = {
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      tour_package: body.tour_package || null,

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

      adults: body.adults || 1,
      children: body.children || 0,

      currency: body.currency || "USD",
      notes: body.notes || null,

      quoted_price: body.quoted_price || null,
      payment_method: body.payment_method || null,
      payment_reference: body.payment_reference || null,
    };

    // ================= SAVE BOOKING =================
    const [newBooking] = await db
      .insert(bookings)
      .values(cleanedBody)
      .execute();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const tour = body.tour_package || "Not specified";
    const startDate = body.travel_start_date || "N/A";
    const endDate = body.travel_end_date || "N/A";
    const travelers = `${body.adults || 1} Adults, ${
      body.children || 0
    } Children`;

    const clientEmailTemplate = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 20px; overflow: hidden; background-color: #fdfdfd;">

        <div style="background-color: #3d2b1f; padding: 30px; text-align: center;">
           <h1 style="color: #e5b078; margin: 0; font-family: serif;">
              LYNVISTA SAFARIS
           </h1>
           <p style="color: #ffffff; font-size: 14px; margin-top: 5px;">
              Your Adventure Awaits
           </p>
        </div>

        <div style="padding: 30px; color: #3d2b1f;">
          <h2>Hello ${body.full_name},</h2>

          <p style="line-height: 1.6;">
            Thank you for choosing Lynvista Safaris.
            We have successfully received your booking request.
            Our team will review it shortly.
          </p>

          <div style="background-color: #f4f1ed; padding: 20px; border-radius: 12px; margin: 25px 0;">
            <p><strong>Tour:</strong> ${tour}</p>
            <p><strong>Travel Dates:</strong> ${startDate} → ${endDate}</p>
            <p><strong>Travelers:</strong> ${travelers}</p>
            <p><strong>Status:</strong>
              <span style="color: #d97706;">Pending</span>
            </p>
          </div>

          <p>We will contact you shortly.</p>

          <p>
            Warm regards,<br/>
            <strong>The Lynvista Safaris Team</strong>
          </p>
        </div>

        <div style="background-color: #3d2b1f; padding: 15px; text-align: center; color: #e5b078; font-size: 12px;">
          © ${new Date().getFullYear()} Lynvista Safaris Limited.
        </div>

      </div>
    `;

    const adminEmailTemplate = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 20px; overflow: hidden; background-color: #fdfdfd;">

        <div style="background-color: #3d2b1f; padding: 30px; text-align: center;">
           <h1 style="color: #e5b078; margin: 0; font-family: serif;">
              NEW BOOKING ALERT
           </h1>
        </div>

        <div style="padding: 30px; color: #3d2b1f;">
          <h2>🚨 Booking From ${body.full_name}</h2>

          <div style="background-color: #f4f1ed; padding: 20px; border-radius: 12px; margin: 25px 0;">
            <p><strong>Name:</strong> ${body.full_name}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            <p><strong>Phone:</strong> ${body.phone}</p>
            <p><strong>Tour:</strong> ${tour}</p>
            <p><strong>Travel Dates:</strong> ${startDate} → ${endDate}</p>
            <p><strong>Travelers:</strong> ${travelers}</p>
            <p><strong>Status:</strong>
              <span style="color: #d97706;">Pending</span>
            </p>
          </div>

          <p>Check admin dashboard for details.</p>
        </div>

        <div style="background-color: #3d2b1f; padding: 15px; text-align: center; color: #e5b078; font-size: 12px;">
          © ${new Date().getFullYear()} Lynvista Safaris Limited.
        </div>

      </div>
    `;

    await transporter.sendMail({
      from: `"Lynvista Safaris" <${process.env.EMAIL_USER}>`,
      to: body.email,
      subject: "🎉 Booking Confirmation - Lynvista Safaris",
      html: clientEmailTemplate,
    });

    await transporter.sendMail({
      from: `"Lynvista Safaris System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "🚨 New Booking Received",
      html: adminEmailTemplate,
    });

    return NextResponse.json({
      success: true,
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Booking failed",
      },
      { status: 500 },
    );
  }
}
