import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;

  // 1. Define Public GET patterns (Data that can be viewed by anyone)
  const isPublicGet =
    (pathname.startsWith("/api/tours") ||
      pathname.startsWith("/api/services") ||
      pathname.startsWith("/api/bookings/public") ||
      pathname.startsWith("/api/verify-payment")) &&
    req.method === "GET";

  // 2. Define Public Booking Lookup (Allow users to see their specific confirmation)
  // Matches /api/bookings/[id] only for GET requests
  const isBookingLookup =
    /^\/api\/bookings\/[^/]+$/.test(pathname) && req.method === "GET";

  // 3. Define Public POST/Form submissions (Bookings, Inquiries, Payments)
  const isPublicPost =
    pathname === "/api/bookings" ||
    pathname === "/api/inquiry" ||
    pathname.startsWith("/api/daraja") ||
    pathname.startsWith("/api/intasend");

  // 4. Define Public Admin Auth
  const isPublicAuth =
    pathname === "/admin/login" || pathname.startsWith("/api/admin/auth");

  const isPublicRoute =
    isPublicGet || isBookingLookup || isPublicPost || isPublicAuth;

  // 5. Strict Admin Protection (UI)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // 6. Strict API Protection
  // If it's an API route and NOT public, require an admin token
  if (pathname.startsWith("/api") && !isPublicRoute && !token) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }

  return NextResponse.next();
}
//
export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
