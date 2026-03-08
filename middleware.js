import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("admin_token")?.value;

  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

// Protect ONLY admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
