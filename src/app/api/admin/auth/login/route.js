import { db } from "@/app/db/db";
import { admins } from "@/app/db/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Fetch admin
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, normalizedEmail))
      .limit(1);

    // 2. Safety Check: Use generic message for security
    if (!admin) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 3. Verify Password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 4. Generate JWT
    // 🛡️ Ensure JWT_SECRET is defined in your .env
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error(
        "CRITICAL: JWT_SECRET is not defined in environment variables.",
      );
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 },
      );
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role }, // Keep payload small
      secret,
      { expiresIn: "24h" }, // Shorter expiry is safer for admin sessions
    );

    // 5. Create Response & Set Secure Cookie
    const response = NextResponse.json({
      success: true,
      user: { email: admin.email, role: admin.role },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true, // 🔒 Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === "production", // 🔒 Only sent over HTTPS
      sameSite: "strict", // 🔒 Prevents CSRF
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
