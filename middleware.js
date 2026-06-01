import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;

  // ==========================================
  // PROTECT RESHARED PAYMENT & CONFIRMATION LINKS
  // ==========================================

  // A. Protect M-Pesa Page (/pay/mpesa/...)
  if (pathname.startsWith("/pay/mpesa")) {
    // Safely extract ID from either path (/pay/mpesa/123) or query params (?id=123)
    const pathSegments = pathname.split("/").filter(Boolean);
    const pathId = pathSegments.length > 2 ? pathSegments[2] : null;
    const bookingId = pathId || searchParams.get("id");

    // If we can't find an ID in the URL, treat the cookie as missing
    const hasMpesaCookie = bookingId
      ? req.cookies.get(`mpesa_session_${bookingId}`)?.value
      : null;

    if (!hasMpesaCookie && !token) {
      return NextResponse.redirect(new URL("/pay/expired", req.url));
    }
  }

  // B. Protect Card Payment Page (/pay/card/...)
  if (pathname.startsWith("/pay/card")) {
    const pathSegments = pathname.split("/").filter(Boolean);
    const pathId = pathSegments.length > 2 ? pathSegments[2] : null;
    const bookingId = pathId || searchParams.get("id");

    const hasCardCookie = bookingId
      ? req.cookies.get(`card_session_${bookingId}`)?.value
      : null;

    if (!hasCardCookie && !token) {
      return NextResponse.redirect(new URL("/pay/expired", req.url));
    }
  }

  // C. Protect Booking Confirmation & Success Pages
  if (
    pathname.startsWith("/book/confirmation") ||
    pathname.startsWith("/pay/payment-success")
  ) {
    const hasConfirmationCookie = req.cookies.get(
      "valid_booking_session",
    )?.value;

    if (!hasConfirmationCookie && !token) {
      return NextResponse.redirect(new URL("/book/expired", req.url));
    }
  }

  // ==========================================
  // EXISTING ROUTE RULES
  // ==========================================

  const isPublicGet =
    (pathname.startsWith("/api/tours") ||
      pathname.startsWith("/api/services") ||
      pathname.startsWith("/api/bookings/public") ||
      pathname.startsWith("/api/verify-payment")) &&
    req.method === "GET";

  const isBookingLookup =
    /^\/api\/bookings\/[^/]+$/.test(pathname) && req.method === "GET";

  const isPublicPost =
    pathname === "/api/bookings" ||
    pathname === "/api/inquiry" ||
    pathname.startsWith("/api/daraja") ||
    pathname.startsWith("/api/intasend");

  const isPublicAuth =
    pathname === "/admin/login" || pathname.startsWith("/api/admin/auth");

  const isPublicRoute =
    isPublicGet || isBookingLookup || isPublicPost || isPublicAuth;

  // 5. Strict Admin Protection (UI)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // 6. Strict API Protection
  if (pathname.startsWith("/api") && !isPublicRoute && !token) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }

  return NextResponse.next();
}

// ==========================================
// CONFIG MATCHER ARRAY
// ==========================================
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/pay/card/:path*",
    "/pay/mpesa/:path*",
    "/pay/payment-success/:path*",
    "/book/confirmation/:path*",
  ],
};
