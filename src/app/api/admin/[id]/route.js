import { db } from "@/app/db/db";
import { admins, auditLogs } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // Import cookies

export async function DELETE(req, { params }) {
  try {
    // 1. Await cookies and params (Required in Next.js 15+)
    const cookieStore = await cookies();
    const { id } = await params;
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminIdToDelete = Number(id);

    // 2. Prevent self-deletion
    if (decoded.id === adminIdToDelete) {
      return NextResponse.json(
        { message: "You cannot delete yourself" },
        { status: 403 },
      );
    }

    // 3. Perform Delete
    await db.delete(admins).where(eq(admins.id, adminIdToDelete));

    // 4. Log the action
    await db.insert(auditLogs).values({
      admin_id: decoded.id,
      action: `Deleted admin ID: ${adminIdToDelete}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
