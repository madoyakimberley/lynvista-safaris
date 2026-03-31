import { db } from "@/app/db/db";
import { tours } from "@/app/db/schema";
import { NextResponse } from "next/server";

// GET: fetch all tours from MySQL
export async function GET() {
  try {
    const allTours = await db.select().from(tours);
    return NextResponse.json(allTours);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// POST: add a new tour
export async function POST(req) {
  try {
    const body = await req.json();
    const [newTour] = await db.insert(tours).values(body).returning();
    return NextResponse.json(newTour);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// DELETE: delete a tour
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await db.delete(tours).where(tours.id.eq(Number(id)));
    return NextResponse.json({ message: "Tour deleted" });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
