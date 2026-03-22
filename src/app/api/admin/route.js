import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { services } from "@/app/db/schema";
import { eq } from "drizzle-orm";

/*
=====================
GET ALL SERVICES
=====================
*/
export async function GET() {
  try {
    const data = await db.select().from(services);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

/*
=====================
CREATE SERVICE
=====================
*/
export async function POST(req) {
  try {
    const body = await req.json();

    const result = await db.insert(services).values({
      name: body.name,
      description: body.description,
      icon_name: body.icon_name,
      is_active: body.is_active ?? 1,
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

/*
=====================
DELETE SERVICE
=====================
*/
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await db.delete(services).where(eq(services.id, Number(id)));

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