import { db } from "@/app/db/db";
import { admins, auditLogs } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const adminIdToDelete = parseInt(id);

    // 1. Get and Verify Token
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    // 🛡️ SECURITY GUARD: Block with plain text if no token
    if (!token) {
      return new NextResponse("Unauthorized Access", {
        status: 401,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // 2. Verify JWT Authenticity
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new NextResponse("Unauthorized Access: Invalid Session", {
        status: 401,
      });
    }

    // 3. Prevent self-deletion
    if (decoded.id === adminIdToDelete) {
      return NextResponse.json(
        { message: "You cannot delete your own account." },
        { status: 403 },
      );
    }

    // 4. Atomic Database Operation (Transaction)
    const result = await db.transaction(async (tx) => {
      // First, check if the admin exists
      const [existingAdmin] = await tx
        .select()
        .from(admins)
        .where(eq(admins.id, adminIdToDelete));

      if (!existingAdmin) return null;

      // Execute delete
      await tx.delete(admins).where(eq(admins.id, adminIdToDelete));

      // Log the action into auditLogs
      await tx.insert(auditLogs).values({
        admin_id: decoded.id,
        action: `Deleted admin ID: ${adminIdToDelete}`,
      });

      return existingAdmin;
    });

    if (!result) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    // Generic catch-all to prevent leaking server details
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
