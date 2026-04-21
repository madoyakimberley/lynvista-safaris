import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // 🛡️ SECURITY MATCHING: Clear the cookie with same flags used during login
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Match your login route
    path: "/",
    expires: new Date(0), // Forces immediate expiration
  });

  return response;
}
