import { db } from "@/app/db/db";
import { services } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    // Next.js requires awaiting params before destructuring
    const { id } = await params;

    await db
      .update(services)
      .set({
        name: body.name,
        description: body.description,
        icon_name: body.icon_name,
        is_active: body.is_active,
      })
      .where(eq(services.id, Number(id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    // Next.js requires awaiting params before destructuring
    const { id } = await params;

    await db.delete(services).where(eq(services.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 },
    );
  }
}
