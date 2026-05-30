import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // MUST be an App Password
  },
});

// Shared template structure based on your design requirements
const getEmailTemplate = (content, headerTitle) => `
<!DOCTYPE html>
<html>
<head>
<style>
  @media (prefers-color-scheme: dark) {
    body { background-color: #121212 !important; color: #e0e0e0 !important; }
    .container { background-color: #1e1e1e !important; border: 1px solid #333 !important; }
    .details-box { background-color: #2d2d2d !important; }
  }
  body { font-family: sans-serif; margin: 0; padding: 20px; }
  .container { max-width: 500px; margin: auto; border: 1px solid #e0e0e0; border-radius: 20px; overflow: hidden; background: #ffffff; }
  .header { background: #4a3728; padding: 30px; text-align: center; color: #d4af37; }
  .body { padding: 30px; }
  .details-box { background: #f5f2ef; padding: 20px; border-radius: 12px; margin: 20px 0; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;">LYNVISTA SAFARIS</h1>
      <p style="margin:5px 0 0; color:#fff;">Your Adventure Awaits</p>
    </div>
    <div class="body">
      <h2 style="color:inherit;">${headerTitle}</h2>
      ${content}
      <p>Warm regards,<br><strong>The Lynvista Safaris Team</strong></p>
    </div>
  </div>
</body>
</html>
`;

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. SAVE TO DATABASE
    const result = await db.insert(bookings).values({
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      tour_package: body.tour_package,
      currency: body.currency || "USD",
      payment_method: body.payment_method || "Other",
      travel_start_date: body.travel_start_date,
      travel_end_date: body.travel_end_date,
      adults: parseInt(body.adults) || 1,
      children: parseInt(body.children) || 0,
      quoted_price: String(body.quoted_price || "0.00"),
      notes: body.notes,
      managed_status: "Pending",
      payment_status: "Pending",
    });

    // Handle Drizzle ORM result structure to extract the insert ID
    const newBookingId = Array.isArray(result)
      ? result[0]?.insertId
      : result.insertId;

    if (!newBookingId) {
      throw new Error("Failed to capture new booking ID from database.");
    }

    // Common details section used in both emails
    const detailsHtml = `
      <div class="details-box">
        <p style="margin:5px 0;"><strong>Tour:</strong> ${body.tour_package}</p>
        <p style="margin:5px 0;"><strong>Dates:</strong> ${body.travel_start_date} → ${body.travel_end_date}</p>
        <p style="margin:5px 0;"><strong>Travelers:</strong> ${body.adults} Adults, ${body.children} Children</p>
        <p style="margin:5px 0;"><strong>Payment Method:</strong> ${body.payment_method}</p>
      </div>`;

    // 2. EMAIL CONTENT
    const clientContent = `<p>Thank you for choosing Lynvista Safaris. We have received your booking request.</p>${detailsHtml}`;
    const adminContent = `<p><strong>🚨 New Booking Received (ID: ${newBookingId})</strong></p>
                          <p><strong>Client:</strong> ${body.full_name} (${body.email})<br>
                          <strong>Phone:</strong> ${body.phone}</p>${detailsHtml}`;

    // 3. SEND EMAILS
    await transporter.sendMail({
      from: `"Lynvista Safaris" <${process.env.EMAIL_USER}>`,
      to: body.email,
      subject: "Booking Confirmation - Lynvista Safaris",
      html: getEmailTemplate(clientContent, "Hello " + body.full_name + ","),
    });

    await transporter.sendMail({
      from: `"Lynvista System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking #${newBookingId}`,
      html: getEmailTemplate(adminContent, "New Booking Notification"),
    });

    return NextResponse.json({ success: true, id: newBookingId });
  } catch (error) {
    console.error("Submission Failed:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
