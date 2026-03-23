import { db } from "@/app/db/db";
import { services, auditLogs } from "@/app/db/schema";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { eq, desc } from "drizzle-orm";

/* =====================================================
   GET ALL SERVICES
===================================================== */
export async function GET() {
  try {
    const data = await db
      .select()
      .from(services)
      .orderBy(desc(services.id));

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

/* =====================================================
   CREATE SERVICE
===================================================== */
export async function POST(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "super_admin") {
      return NextResponse.json(
        { message: "Only super admin can create services" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const result = await db.insert(services).values({
      name: body.name,
      description: body.description,
      icon_name: body.icon_name,
      is_active: body.is_active ?? 1,
    });

    // Optional audit log
    await db.insert(auditLogs).values({
      admin_id: decoded.id,
      action: `Created service ${body.name}`,
    });

    return NextResponse.json({
      message: "Service created successfully",
      result,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Service creation failed" },
      { status: 500 }
    );
  }
}

/* =====================================================
   DELETE SERVICE
===================================================== */
export async function DELETE(req) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "super_admin") {
      return NextResponse.json(
        { message: "Only super admin can delete services" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Service ID is required" },
        { status: 400 }
      );
    }

    await db.delete(services).where(eq(services.id, Number(id)));

    await db.insert(auditLogs).values({
      admin_id: decoded.id,
      action: `Deleted service ID ${id}`,
    });

    return NextResponse.json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Delete failed" },
      { status: 500 }
    );
  }
}
