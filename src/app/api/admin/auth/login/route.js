import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
// Import your automated schema alongside the admins table
import { admins, adminLoginSchema } from "@/app/db/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const body = await req.json();

    // 1. RUN SECURITY VALIDATION
    // Zod handles checking for missing strings, length limits, and correct email structure all at once.
    const validation = adminLoginSchema.safeParse(body);

    if (!validation.success) {
      // Return a completely generic "Invalid credentials" message to keep them guessing.
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Extract clean, normalized data straight from Zod (includes internal trim optimization)
    const { email, password } = validation.data;
    const normalizedEmail = email.toLowerCase();

    // 2. FETCH ADMIN FROM DATABASE
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, normalizedEmail))
      .limit(1);

    // 3. SAFETY CHECK: User Enumeration Prevention
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 4. VERIFY PASSWORD
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 5. GENERATE JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Log the true critical system setup failure privately to your console
      console.error(
        "CRITICAL: JWT_SECRET is missing in environment variables.",
      );

      // Serve up your beautiful black-hole error message to the client
      return NextResponse.json(
        { message: "An unexpected error occurred" },
        { status: 500 },
      );
    }

    const token = jwt.sign({ id: admin.id, role: admin.role }, secret, {
      expiresIn: "24h",
    });

    // 6. CREATE RESPONSE & SET SECURE COOKIE
    const response = NextResponse.json({
      success: true,
      user: { email: admin.email, role: admin.role },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true, // 🔒 Completely shields cookie away from malicious JavaScript execution (XSS)
      secure: true, // 🔒 Forces transmission strictly over encrypted HTTPS channels
      sameSite: "strict", // 🔒 Denies transmission during cross-site navigations (CSRF protection)
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err) {
    console.error("Login Error Exceptions Flagged:", err);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
