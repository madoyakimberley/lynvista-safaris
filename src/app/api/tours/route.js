import * as Sentry from "@sentry/nextjs";
import { db } from "@/app/db/db";
import { tours } from "@/app/db/schema";
import { NextResponse } from "next/server";

// GET: fetch all tours from MySQL
export async function GET() {
  try {
    const allTours = await db.select().from(tours);
    // Kept your exact return structure so the frontend doesn't break
    return NextResponse.json(allTours);
  } catch (error) {
    // 1. Send to Sentry silently
    Sentry.captureException(error);
    // 2. Log to terminal for you
    console.error("GET Tours Failure:", error);
    // 3. Return a generic message to the client
    return NextResponse.json(
      { message: "An unexpected processing error occurred." },
      { status: 500 },
    );
  }
}

// POST: add a new tour
export async function POST(req) {
  try {
    const body = await req.json();
    const [newTour] = await db.insert(tours).values(body).returning();
    // Kept your exact return structure
    return NextResponse.json(newTour);
  } catch (error) {
    Sentry.captureException(error);
    console.error("POST Tour Failure:", error);
    return NextResponse.json(
      { message: "An unexpected processing error occurred." },
      { status: 500 },
    );
  }
}

// DELETE: delete a tour
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Quick safety check: ensure the ID was actually sent before hitting the database
    if (!id) {
      return NextResponse.json(
        { message: "Tour ID is required." },
        { status: 400 },
      );
    }

    await db.delete(tours).where(tours.id.eq(Number(id)));
    // Kept your exact return structure
    return NextResponse.json({ message: "Tour deleted" });
  } catch (error) {
    Sentry.captureException(error);
    console.error("DELETE Tour Failure:", error);
    return NextResponse.json(
      { message: "An unexpected processing error occurred." },
      { status: 500 },
    );
  }
}
