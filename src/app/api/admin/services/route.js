import { db } from "@/app/db/db";
import { services } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(services);
  return NextResponse.json(data);
}

export async function POST(req) {
  const body = await req.json();

  if (!body.icon_name) {
    return NextResponse.json({ error: "Icon is required" }, { status: 400 });
  }

  await db.insert(services).values(body);

  return NextResponse.json({ success: true });
}
