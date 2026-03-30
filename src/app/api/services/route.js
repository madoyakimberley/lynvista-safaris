import { db } from "@/app/db/db";
import { services, auditLogs } from "@/app/db/schema";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { eq, desc } from "drizzle-orm";

/* =====================================================
   HELPER: GET TOKEN (Cookie OR Header)
===================================================== */
function getToken(req) {
  const cookieToken = req.cookies.get("admin_token")?.value;

  const authHeader = req.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  return cookieToken || headerToken;
}

/* =====================================================
   GET ALL SERVICES
===================================================== */
export async function GET() {
  try {
    const data = await db.select().from(services).orderBy(desc(services.id));

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET SERVICES ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch services" },
      { status: 500 },
    );
  }
}

/* =====================================================
   CREATE SERVICE
===================================================== */
export async function POST(req) {
  try {
    const token = getToken(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "super_admin") {
      return NextResponse.json(
        { message: "Only super admin can create services" },
        { status: 403 },
      );
    }

    const body = await req.json();

    // 🔥 VALIDATION
    if (!body.name || !body.icon_name) {
      return NextResponse.json(
        { message: "Name and icon are required" },
        { status: 400 },
      );
    }

    const result = await db.insert(services).values({
      name: body.name,
      description: body.description || "",
      icon_name: body.icon_name,
      is_active: body.is_active ?? 1,
    });

    await db.insert(auditLogs).values({
      admin_id: decoded.id,
      action: `Created service ${body.name}`,
    });

    return NextResponse.json({
      message: "Service created successfully",
      result,
    });
  } catch (error) {
    console.error("POST SERVICE ERROR:", error);
    return NextResponse.json(
      { message: "Service creation failed", error: error.message },
      { status: 500 },
    );
  }
}

/* =====================================================
   DELETE SERVICE
===================================================== */
export async function DELETE(req) {
  try {
    const token = getToken(req);

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "super_admin") {
      return NextResponse.json(
        { message: "Only super admin can delete services" },
        { status: 403 },
      );
    }

    let id;

    // ✅ Support BOTH query + body
    const { searchParams } = new URL(req.url);
    id = searchParams.get("id");

    if (!id) {
      const body = await req.json();
      id = body.id;
    }

    if (!id) {
      return NextResponse.json(
        { message: "Service ID is required" },
        { status: 400 },
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
    console.error("DELETE SERVICE ERROR:", error);
    return NextResponse.json(
      { message: "Delete failed", error: error.message },
      { status: 500 },
    );
  }
}
