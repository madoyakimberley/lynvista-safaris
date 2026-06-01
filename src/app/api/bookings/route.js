import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { bookings, insertBookingSchema } from "@/app/db/schema";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY,
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

    // 1. RUN SECURITY VALIDATION
    const validation = insertBookingSchema.safeParse(body);

    // If validation fails, stop execution immediately and pass descriptive errors back to the UI
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // 2. EXTRACT SAFE, SANITIZED DATA
    const validatedData = validation.data;

    // 3. SAVE TO DATABASE
    const result = await db.insert(bookings).values({
      full_name: validatedData.full_name,
      email: validatedData.email,
      phone: validatedData.phone,
      tour_package: validatedData.tour_package,
      currency: validatedData.currency || "USD",
      payment_method: body.payment_method || "Bank Transfer",
      travel_start_date: validatedData.travel_start_date,
      travel_end_date: validatedData.travel_end_date,
      adults: validatedData.adults,
      children: validatedData.children,
      notes: validatedData.notes,
      quoted_price: String(body.quoted_price || "0.00"),
      managed_status: "Pending",
      payment_status: "Pending",
    });

    console.log("DB INSERT RESULT:", result);

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
        <p style="margin:5px 0;"><strong>Tour:</strong> ${validatedData.tour_package || "Custom Package"}</p>
        <p style="margin:5px 0;"><strong>Dates:</strong> ${validatedData.travel_start_date || "TBD"} → ${validatedData.travel_end_date || "TBD"}</p>
        <p style="margin:5px 0;"><strong>Travelers:</strong> ${validatedData.adults} Adults, ${validatedData.children} Children</p>
        <p style="margin:5px 0;"><strong>Special Requests / Notes:</strong> ${validatedData.notes || "None"}</p>
      </div>`;

    // 4. EMAIL CONTENT
    const clientContent = `<p>Thank you for choosing Lynvista Safaris. We have received your booking request.</p>${detailsHtml}`;
    const adminContent = `<p><strong>🚨 New Booking Received (ID: ${newBookingId})</strong></p>
                          <p><strong>Client:</strong> ${validatedData.full_name} (${validatedData.email})<br>
                          <strong>Phone:</strong> ${validatedData.phone}</p>${detailsHtml}`;

    // 5. SEND EMAILS
    await transporter.sendMail({
      from: `"Lynvista Safaris" <${process.env.EMAIL_USER}>`,
      to: validatedData.email,
      subject: "Booking Confirmation - Lynvista Safaris",
      html: getEmailTemplate(
        clientContent,
        "Hello " + validatedData.full_name + ",",
      ),
    });

    await transporter.sendMail({
      from: `"Lynvista System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking #${newBookingId}`,
      html: getEmailTemplate(adminContent, "New Booking Notification"),
    });

    return NextResponse.json({ success: true, id: newBookingId });
  } catch (error) {
    // 6. THE SECURITY & OBSERVABILITY NET

    // Capture the raw error for your dashboard
    Sentry.captureException(error);

    // Print to your local terminal
    console.error("Booking Submission Failed:", error);

    // Return the safe generic message (removed error.message)
    return NextResponse.json(
      { success: false, message: "An unexpected processing error occurred." },
      { status: 500 },
    );
  }
}
