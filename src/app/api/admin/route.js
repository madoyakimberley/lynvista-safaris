import { db } from "@/app/db/db";
import { admins, auditLogs } from "@/app/db/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { desc, eq } from "drizzle-orm";

/* =====================================================
   GET ALL ADMINS
===================================================== */
export async function GET(req) {
  // 1. Get the token from cookies
  const token = req.cookies.get("admin_token")?.value;

  // 2. BLOCK DATA: If no token, return "Unauthorized" immediately
  if (!token) {
    return new NextResponse("Unauthorized Access", {
      status: 401,
      headers: { "Content-Type": "text/plain" },
    });
  }

  try {
    // 3. Optional: Verify JWT validity here for extra safety
    jwt.verify(token, process.env.JWT_SECRET);

    const data = await db
      .select({
        id: admins.id,
        email: admins.email,
        role: admins.role,
        created_at: admins.created_at,
      })
      .from(admins)
      .orderBy(desc(admins.created_at));

    return NextResponse.json(data);
  } catch (error) {
    // If JWT is invalid or expired, return Unauthorized instead of data
    return new NextResponse("Unauthorized Access", { status: 401 });
  }
}

/* =====================================================
   CREATE ADMIN
===================================================== */
export async function POST(req) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return new NextResponse("Unauthorized Access", { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "super_admin") {
      return new NextResponse("Forbidden: Super Admin access required", {
        status: 403,
      });
    }

    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.insert(admins).values({
      email,
      password_hash: hashed,
      role: role || "admin",
    });

    await db.insert(auditLogs).values({
      admin_id: decoded.id,
      action: `Created admin: ${email}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Unauthorized Access", { status: 401 });
  }
}
