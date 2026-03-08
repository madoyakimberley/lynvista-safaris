import { db } from "@/app/db/db";
import { admins, auditLogs } from "@/app/db/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { desc, eq } from "drizzle-orm";

/* =====================================================
   GET ALL ADMINS (No Pagination)
===================================================== */
export async function GET(req) {
  try {
    const data = await db
      .select()
      .from(admins)
      .orderBy(desc(admins.created_at));

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch" }, { status: 500 });
  }
}

/* =====================================================
   CREATE ADMIN
===================================================== */
export async function POST(req) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.role !== "super_admin") {
    return NextResponse.json(
      { message: "Only super admin can create admins" },
      { status: 403 },
    );
  }

  const { email, password, role } = await req.json();
  const hashed = await bcrypt.hash(password, 10);

  await db
    .insert(admins)
    .values({ email, password_hash: hashed, role: role || "admin" });
  await db
    .insert(auditLogs)
    .values({ admin_id: decoded.id, action: `Created admin ${email}` });

  return NextResponse.json({ success: true });
}
