import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { desc } from "drizzle-orm";
// Update this import to point to your actual Drizzle schema file
import { inquiries } from "@/app/db/schema";

export async function GET() {
  try {
    const data = await db
      .select()
      .from(inquiries)
      .orderBy(desc(inquiries.created_at));

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 },
    );
  }
}
