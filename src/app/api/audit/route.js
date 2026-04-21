import { db } from "@/app/db/db";
import { auditLogs } from "@/app/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

// GET: Fetch all logs
export async function GET(req) {
  // 🛡️ SECURITY GUARD
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return new NextResponse("Unauthorized Access", { status: 401 });
  }

  try {
    const logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.created_at))
      .limit(50); // Limit to 50 to ensure fast loading

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Audit GET Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch logs" },
      { status: 500 },
    );
  }
}

// DELETE: Clear all logs
export async function DELETE(req) {
  // 🛡️ SECURITY GUARD
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return new NextResponse("Unauthorized Access", { status: 401 });
  }

  try {
    // We use delete() because TRUNCATE often causes timeouts/permission errors
    await db.delete(auditLogs);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Audit DELETE Error:", error);
    return NextResponse.json(
      { message: "Failed to clear logs" },
      { status: 500 },
    );
  }
}
