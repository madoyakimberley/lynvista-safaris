import { db } from "@/app/db/db";
import { services } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(request, context) {
  // ✅ FIX — unwrap params properly
  const { params } = context;
  const id = Number((await params).id);

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: "Invalid service id" }, { status: 400 });
  }

  await db.delete(services).where(eq(services.id, id));

  return NextResponse.json({ success: true });
}
