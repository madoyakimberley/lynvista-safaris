import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();

    // ================= SAVE BOOKING TO DATABASE =================
    const [newBooking] = await db.insert(bookings).values(body).execute();

    // ================= TRANSPORTER SETUP =================
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ==========================================================
    // ================= CLIENT EMAIL TEMPLATE ===================
    // ==========================================================

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
            <p><strong>Tour:</strong> ${body.tour_package}</p>
            <p><strong>Travel Dates:</strong> ${body.travel_start_date} → ${body.travel_end_date}</p>
            <p><strong>Travelers:</strong> ${body.travelers}</p>
            <p><strong>Status:</strong>
              <span style="color: #d97706;">Pending</span>
            </p>
          </div>

          <p>
            We will contact you via email or phone shortly.
          </p>

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

    // ==========================================================
    // ================= ADMIN EMAIL TEMPLATE ====================
    // ==========================================================

    const adminEmailTemplate = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 20px; overflow: hidden; background-color: #fdfdfd;">

        <div style="background-color: #3d2b1f; padding: 30px; text-align: center;">
           <h1 style="color: #e5b078; margin: 0; font-family: serif;">
              NEW BOOKING ALERT
           </h1>
           <p style="color: #ffffff; font-size: 14px; margin-top: 5px;">
              Admin Notification
           </p>
        </div>

        <div style="padding: 30px; color: #3d2b1f;">

          <h2>🚨 Booking From ${body.full_name}</h2>

          <p>
            A new booking has been submitted through the website.
            Please review it in the admin dashboard.
          </p>

          <div style="background-color: #f4f1ed; padding: 20px; border-radius: 12px; margin: 25px 0;">
            <p><strong>Name:</strong> ${body.full_name}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            <p><strong>Phone:</strong> ${body.phone}</p>
            <p><strong>Tour:</strong> ${body.tour_package}</p>
            <p><strong>Travel Dates:</strong>
              ${body.travel_start_date} → ${body.travel_end_date}
            </p>
            <p><strong>Travelers:</strong> ${body.travelers}</p>
            <p>
              <strong>Status:</strong>
              <span style="color: #d97706;">Pending</span>
            </p>
          </div>

          <p>
            Please log into the admin panel to confirm or update this booking.
          </p>

        </div>

        <div style="background-color: #3d2b1f; padding: 15px; text-align: center; color: #e5b078; font-size: 12px;">
          © ${new Date().getFullYear()} Lynvista Safaris Limited.
        </div>

      </div>
    `;

    // ==========================================================
    // ================= SEND EMAIL TO CLIENT ====================
    // ==========================================================

    await transporter.sendMail({
      from: `"Lynvista Safaris" <${process.env.EMAIL_USER}>`,
      to: body.email,
      subject: "🎉 Booking Confirmation - Lynvista Safaris",
      html: clientEmailTemplate,
    });

    // ==========================================================
    // ================= SEND EMAIL TO ADMIN =====================
    // ==========================================================

    await transporter.sendMail({
      from: `"Lynvista Safaris System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // 👈 ADD THIS TO YOUR .env
      subject: "🚨 New Booking Received",
      html: adminEmailTemplate,
    });

    // ==========================================================
    // ================= RESPONSE ================================
    // ==========================================================

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
