// middleware.js
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ==========================================
// INITIALIZE UPSTASH RATE LIMITER
// ==========================================
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export async function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;

  // 1. Bot Detection: Prevents scrapers/social-previews from triggering redirects
  const userAgent = req.headers.get("user-agent") || "";
  const isBot =
    /bot|googlebot|crawler|spider|facebookexternalhit|whatsapp|twitterbot/i.test(
      userAgent,
    );

  // ==========================================
  // EDGE RATE LIMITING LAYER
  // ==========================================
  const isSensitiveApi =
    pathname === "/api/bookings" ||
    pathname === "/api/inquiry" ||
    pathname.startsWith("/api/daraja") ||
    pathname.startsWith("/api/intasend");

  if (isSensitiveApi) {
    const ip = req.ip ?? "127.0.0.1";
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Upstash rate limit timeout")), 600),
      );

      const { success, limit, remaining, reset } = await Promise.race([
        ratelimit.limit(ip),
        timeoutPromise,
      ]);

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
    } catch (error) {
      console.warn(
        "Rate limiting temporarily bypassed due to latency/timeout:",
        error.message,
      );
    }
  }

  // ==========================================
  // TOKEN & SESSIONS SETUP
  // ==========================================
  // Unified admin token fetch (Used for page access rules)
  const token = req.cookies.get("admin_token")?.value;

  // ==========================================
  // PROTECT RESHARED PAYMENT & CONFIRMATION LINKS
  // ==========================================

  // Logic to identify booking ID regardless of URL structure
  const getBookingId = (prefix) => {
    const segments = pathname
      .split(prefix)
      .filter(Boolean)[0]
      ?.split("/")
      .filter(Boolean);
    return (segments && segments[0]) || searchParams.get("id");
  };

  // ONLY enforce expiration if it's a real user (not a bot)
  if (!isBot) {
    // ==========================================
    // A & B. Protect M-Pesa & Card Payment Pages
    // ==========================================
    if (pathname.startsWith("/pay/mpesa") || pathname.startsWith("/pay/card")) {
      const isMpesa = pathname.startsWith("/pay/mpesa");
      const routeType = isMpesa ? "mpesa" : "card";
      const pathPrefix = isMpesa ? "/pay/mpesa" : "/pay/card";

      // FIX: Pass the specific prefix string down to parse the dynamic ID correctly
      const id = getBookingId(pathPrefix);

      if (id) {
        const sessionCookie = req.cookies.get(
          `${routeType}_session_${id}`,
        )?.value;

        // Only redirect if the user does not have an active session cookie AND isn't logged in as admin
        if (!sessionCookie && !token) {
          console.log(
            `[Middleware] Blocked: No session or token for ${routeType} ID: ${id}`,
          );
          return NextResponse.redirect(new URL("/pay/expired", req.url));
        }
      }
    }

    // ==========================================
    // C. Protect Booking Confirmation & Success
    // ==========================================
    if (
      pathname.startsWith("/book/confirmation") ||
      pathname.startsWith("/pay/payment-success")
    ) {
      const bookingSession = req.cookies.get("valid_booking_session")?.value;

      if (!bookingSession && !token) {
        console.log("[Middleware] Blocked: No valid booking session or token.");
        return NextResponse.redirect(new URL("/book/expired", req.url));
      }
    }
  }

  // ==========================================
  // ROUTE RULES & SECURITY
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
    "/pay/:path*",
    "/book/confirmation/:path*",
  ],
};
