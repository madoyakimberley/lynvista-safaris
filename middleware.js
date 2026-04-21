import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;

  // 1. Define Public Routes
  const isPublicRoute =
    pathname === "/admin/login" || pathname.startsWith("/api/admin/auth");

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
