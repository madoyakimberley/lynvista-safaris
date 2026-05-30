import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;

  // 1. Define Public Routes
  // Added /api/tours and /api/bookings so the public can book trips
  const isPublicRoute =
    pathname === "/admin/login" ||
    pathname.startsWith("/api/admin/auth") ||
    pathname === "/api/tours" ||
    pathname === "/api/bookings" ||
    pathname === "/api/services";

  // 2. Protect Admin & API routes
  const isProtectedArea =
    pathname.startsWith("/admin") || pathname.startsWith("/api");

  if (isProtectedArea && !isPublicRoute && !token) {
    // Return plain text for API calls or direct browser access
    return new NextResponse(
      "Unauthorized Access: You do not have permission to view this resource.",
      {
        status: 401,
        headers: { "Content-Type": "text/plain" },
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
