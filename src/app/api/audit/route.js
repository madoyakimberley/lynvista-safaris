import { db } from "@/app/db/db";
import { auditLogs } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { desc, sql } from "drizzle-orm";

// GET: Fetch all logs
export async function GET() {
  try {
    const logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.created_at));
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch logs" },
      { status: 500 },
    );
  }
}

// DELETE: Clear all logs
export async function DELETE() {
  try {
    await db.execute(sql`TRUNCATE TABLE audit_logs`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to clear logs" },
      { status: 500 },
    );
  }
}
