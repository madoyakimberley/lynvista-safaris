import { NextResponse } from "next/server";
// Note: jwt.verify usually doesn't work in Next.js Middleware (Edge Runtime)
// You might need to use 'jose' library later, but let's fix the loop first!

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("admin_token")?.value;

  // 1. ALLOW the login page to load without a token
  if (pathname === "/admin/login") {
    // If they already have a valid token, maybe send them to dashboard
    if (token) return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }

  // 2. PROTECT all other admin routes
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
