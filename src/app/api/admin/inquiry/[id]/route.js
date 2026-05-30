import { NextResponse } from "next/server";
import { db } from "@/app/db/db";
import { eq } from "drizzle-orm";
import { inquiries } from "@/app/db/schema";

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    // 💡 FIX: Removed .returning() for MySQL compatibility
    await db
      .update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, parseInt(id)));

    return NextResponse.json({ id: parseInt(id), status }, { status: 200 });
  } catch (error) {
    console.error("Failed to update inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    await db.delete(inquiries).where(eq(inquiries.id, parseInt(id)));

    return NextResponse.json(
      { message: "Inquiry deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to delete inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 },
    );
  }
}
