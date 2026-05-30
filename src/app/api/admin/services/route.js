import { db } from "@/app/db/db";
import { services } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.select().from(services).orderBy(services.created_at);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.icon_name || !body.name || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await db.insert(services).values({
      name: body.name,
      description: body.description,
      icon_name: body.icon_name,
      is_active: body.is_active ?? true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 },
    );
  }
}
