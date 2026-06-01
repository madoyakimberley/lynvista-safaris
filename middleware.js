// middleware.js
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ==========================================
// INITIALIZE UPSTASH RATE LIMITER
// ==========================================
// This connects automatically via your Vercel Environment Variables:
// UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  // Configuration: Allow 10 requests every 10 seconds per IP address
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;

  // ==========================================
  // EDGE RATE LIMITING LAYER
  // ==========================================
  // Enforce rate limiting specifically on sensitive data-submission endpoints
  const isSensitiveApi =
    pathname === "/api/bookings" ||
    pathname === "/api/inquiry" ||
    pathname.startsWith("/api/daraja") ||
    pathname.startsWith("/api/intasend");

  if (isSensitiveApi) {
    // Identify user by their real IP address, falling back to local for dev environments
    const ip = req.ip ?? "127.0.0.1";
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down and try again later." },
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }
  }

  // ==========================================
  // TOKEN & SESSIONS SETUP
  // ==========================================
  const token = req.cookies.get("admin_token")?.value;

  // ==========================================
  // PROTECT RESHARED PAYMENT & CONFIRMATION LINKS
  // ==========================================

  // A. Protect M-Pesa Page (/pay/mpesa/...)
  if (pathname.startsWith("/pay/mpesa")) {
    const pathSegments = pathname.split("/").filter(Boolean);
    const pathId = pathSegments.length > 2 ? pathSegments[2] : null;
    const bookingId = pathId || searchParams.get("id");

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
  // EXISTINGS ROUTE RULES
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
