import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { eq } from "drizzle-orm";
import { inquiries } from "@/app/db/schema";
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

export async function POST(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json();
    const { reply, status } = body;

    if (!reply) {
      return NextResponse.json(
        { error: "Reply message is required" },
        { status: 400 },
      );
    }

    // 1. Fetch the original inquiry to get the user's details
    const [inquiry] = await db
      .select()
      .from(inquiries)
      .where(eq(inquiries.id, parseInt(id)));

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    // Beautifully decorated HTML email markup
    const htmlEmailContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Response to Your Inquiry</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #2d1b0b; font-family: 'Inter', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #2d1b0b; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #faf8f3; border-radius: 12px; overflow: hidden; border: 1px solid #5c3d2e; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                  
                  <tr>
                    <td style="background-color: #2d5016; padding: 35px 40px; text-align: center; border-bottom: 4px solid #fbbf24;">
                      <h1 style="margin: 0; font-family: 'Playfair Display', 'Georgia', serif; color: #fbbf24; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                        Lynvista Safaris
                      </h1>
                      <p style="margin: 5px 0 0 0; font-family: 'Inter', sans-serif; color: #faf8f3; font-size: 12px; text-transform: uppercase; tracking-widest: 2px; opacity: 0.8;">
                        Exclusive African Expeditions
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 40px 40px 30px 40px;">
                      <h2 style="margin: 0 0 20px 0; font-family: 'Playfair Display', 'Georgia', serif; color: #2d1b0b; font-size: 20px; font-weight: bold;">
                        Jambo ${inquiry.full_name},
                      </h2>
                      
                      <p style="margin: 0 0 25px 0; color: #5c3d2e; font-size: 15px; line-height: 1.6;">
                        Thank you for reaching out to us regarding your journey. We have carefully reviewed your message regarding 
                        <strong style="color: #2d5016;">"${inquiry.subject}"</strong>. Please find our response outlined below:
                      </p>

                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 30px 0;">
                        <tr>
                          <td style="background-color: #faf8f3; border-left: 4px solid #d97706; padding: 20px; border-top: 1px solid #eadcc9; border-right: 1px solid #eadcc9; border-bottom: 1px solid #eadcc9; border-radius: 0 8px 8px 0;">
                            <p style="margin: 0; color: #2d1b0b; font-size: 15px; line-height: 1.6; white-space: pre-wrap;">${reply}</p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 30px 0; color: #5c3d2e; font-size: 14px; line-height: 1.6;">
                        If you need to make any further adjustments, customize package itineraries, or coordinate specific departure logs, feel free to respond directly to this email or visit our specialized planning channels.
                      </p>

                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 10px auto;">
                        <tr>
                          <td align="center" style="background-color: #2d5016; border-radius: 6px;">
                            <a href="https://lynvistasafaris.com/contact" target="_blank" style="display: inline-block; padding: 14px 32px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: bold; color: #faf8f3; text-decoration: none; border-radius: 6px; border: 1px solid #4a7c2c;">
                              View Your Inquiry Dashboard
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 40px;">
                      <div style="border-top: 1px solid #eadcc9;"></div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 30px 40px 40px 40px; text-align: center; background-color: #faf8f3;">
                      <p style="margin: 0 0 8px 0; color: #2d1b0b; font-family: 'Playfair Display', serif; font-weight: bold; font-size: 14px;">
                        Lynvista Safaris
                      </p>
                      <p style="margin: 0; color: #5c3d2e; font-size: 12px; line-height: 1.4;">
                        Eldoret, Kenya<br>
                        © 2026 Lynvista Safaris. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // 2. Send Email
    await transporter.sendMail({
      from: `"Lynvista Safaris" <${process.env.EMAIL_USER}>`,
      to: inquiry.email,
      subject: `Re: ${inquiry.subject} | Lynvista Safaris`,
      html: htmlEmailContent,
    });

    // 3. Update status in database (💡 MATCHES YOUR SCHEMA ENUM EXACTLY)
    const newStatus = status || "Reviewed";
    await db
      .update(inquiries)
      .set({ status: newStatus })
      .where(eq(inquiries.id, parseInt(id)));

    return NextResponse.json(
      {
        message: "Reply sent successfully",
        inquiry: { ...inquiry, status: newStatus },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to process reply:", error);
    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 },
    );
  }
}
