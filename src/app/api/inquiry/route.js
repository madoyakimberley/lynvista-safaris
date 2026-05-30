import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { inquiries } from "@/app/db/schema";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getEmailTemplate = (content, headerTitle) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: sans-serif; margin: 0; padding: 20px; background-color: #FAF9F4; }
  .container { max-width: 550px; margin: auto; border: 1px solid #3A2E26/10; border-radius: 16px; overflow: hidden; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  .header { background: #4a3219; padding: 35px 20px; text-align: center; }
  .header h1 { margin:0; color: #e9bc47; font-size: 24px; tracking: 0.1em; font-family: serif; }
  .body { padding: 40px 30px; color: #3A2E26; line-height: 1.6; }
  .details-box { background: #FAF9F4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #e9bc47; }
  .footer { text-align: center; padding: 20px; font-size: 11px; color: #a48665; border-t: 1px solid #FAF9F4; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>LYNVISTA SAFARIS</h1>
    </div>
    <div class="body">
      <h2 style="color: #4a3219; font-family: serif; margin-top:0;">${headerTitle}</h2>
      ${content}
      <p style="margin-top: 30px;">Warm regards,<br><strong>The Lynvista Safaris Team</strong></p>
    </div>
    <div class="footer">
      Experiential African Journeys & Bespoke Safaris
    </div>
  </div>
</body>
</html>
`;

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.full_name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // 1. Save to database using newly updated drizzle schema
    const [result] = await db.insert(inquiries).values({
      full_name: body.full_name,
      email: body.email,
      subject: body.subject || "General Safari Inquiry",
      message: body.message,
    });

    const inquiryId = result.insertId;

    const detailsHtml = `
      <div class="details-box">
        <p style="margin: 4px 0;"><strong>Inquiry ID:</strong> #${inquiryId}</p>
        <p style="margin: 4px 0;"><strong>Subject Category:</strong> ${body.subject}</p>
        <p style="margin: 4px 0;"><strong>Message Summary:</strong> ${body.message}</p>
      </div>`;

    // 2. Draft Email Contents
    const clientHtml = `
      <p>Hello ${body.full_name},</p>
      <p>Thank you for reaching out to Lynvista Safaris. We have successfully received your inquiry, and one of our dedicated African travel experts is already reviewing your request.</p>
      ${detailsHtml}
      <p>We aim to respond with bespoke suggestions or follow-up details within 24 hours.</p>
    `;

    const adminHtml = `
      <p><strong>🚨 New Contact Form Inquiry Received</strong></p>
      <p><strong>Client Name:</strong> ${body.full_name}<br/>
      <strong>Client Email:</strong> ${body.email}</p>
      ${detailsHtml}
    `;

    // 3. Dispatch Emails
    await transporter.sendMail({
      from: `"Lynvista Safaris" <${process.env.EMAIL_USER}>`,
      to: body.email,
      subject: "We Have Received Your Inquiry - Lynvista Safaris",
      html: getEmailTemplate(clientHtml, "Your Odyssey Begins Here"),
    });

    await transporter.sendMail({
      from: `"Lynvista System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🚨 New Inquiry Notification #${inquiryId}`,
      html: getEmailTemplate(adminHtml, "New Dashboard Inquiry Raised"),
    });

    return NextResponse.json({ success: true, id: inquiryId });
  } catch (error) {
    console.error("Inquiry Processing Failed:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
