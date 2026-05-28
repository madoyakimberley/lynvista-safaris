import { db } from "@/app/db/db";
import { services, auditLogs } from "@/app/db/schema";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { eq, desc } from "drizzle-orm";

/* =====================================================
   HELPER: GET TOKEN
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
   GET ALL SERVICES (Publicly accessible)
   Updated to filter by 'is_active' so you can toggle visibility
===================================================== */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    let query = db.select().from(services).orderBy(desc(services.id));

    // If not specifically requesting inactive, only return active ones
    if (!includeInactive) {
      query = query.where(eq(services.is_active, 1));
    }

    const data = await query;
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
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "super_admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

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
      action: `Created service: ${body.name}`,
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
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "super_admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      const body = await req.json();
      id = body.id;
    }

    if (!id)
      return NextResponse.json({ message: "ID required" }, { status: 400 });

    await db.delete(services).where(eq(services.id, Number(id)));

    await db.insert(auditLogs).values({
      admin_id: decoded.id,
      action: `Deleted service ID ${id}`,
    });

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("DELETE SERVICE ERROR:", error);
    return NextResponse.json(
      { message: "Delete failed", error: error.message },
      { status: 500 },
    );
  }
}
