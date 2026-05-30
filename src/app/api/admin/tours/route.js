// src/app/api/admin/tours/route.js
import { db } from "@/app/db/db";
import { tours } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

/* =======================
   FETCH ALL TOURS
======================= */
export async function GET() {
  try {
    console.log("📡 GET /admin/tours");

    const allTours = await db.select().from(tours).orderBy(tours.created_at);

    console.log("📦 Tours found:", allTours.length);

    return NextResponse.json(allTours);
  } catch (error) {
    console.error("GET Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 },
    );
  }
}

/* =======================
   CREATE TOUR (FIXED)
======================= */
export async function POST(req) {
  try {
    console.log("📥 POST /admin/tours incoming request");

    const body = await req.json();

    console.log("📥 Raw body:", body);

    const sanitizedData = {
      ...body,
      base_price: body.base_price ? parseFloat(body.base_price) : 0,
    };

    console.log("🧼 Sanitized data:", sanitizedData);

    // ❌ REMOVED .returning() (NOT SUPPORTED IN TIDB / MYSQL DRIZZLE)
    await db.insert(tours).values(sanitizedData);

    console.log("✅ Tour inserted successfully");

    return NextResponse.json({
      success: true,
      message: "Tour created successfully",
    });
  } catch (error) {
    console.error("POST Error:", error);

    return NextResponse.json(
      {
        error: "Failed to create tour",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/* =======================
   UPDATE TOUR
======================= */
export async function PUT(req) {
  try {
    console.log("✏️ PUT /admin/tours");

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const sanitizedId = parseInt(id, 10);

    // ✅ ONLY ALLOW SAFE FIELDS (prevents toISOString crash)
    const sanitizedUpdateData = {
      title: updateData.title,
      slug: updateData.slug,
      description: updateData.description,
      location: updateData.location,
      duration: updateData.duration,
      image: updateData.image,
      base_price: updateData.base_price ? parseFloat(updateData.base_price) : 0,
    };

    // remove undefined values (extra safety)
    Object.keys(sanitizedUpdateData).forEach((key) => {
      if (sanitizedUpdateData[key] === undefined) {
        delete sanitizedUpdateData[key];
      }
    });

    // 1. update record
    await db
      .update(tours)
      .set(sanitizedUpdateData)
      .where(eq(tours.id, sanitizedId));

    // 2. fetch updated record
    const updatedTour = await db
      .select()
      .from(tours)
      .where(eq(tours.id, sanitizedId));

    console.log("✅ Tour updated:", updatedTour[0]);

    return NextResponse.json({
      success: true,
      message: "Tour updated successfully",
      tour: updatedTour[0],
    });
  } catch (error) {
    console.error("PUT Error:", error);

    return NextResponse.json(
      { error: "Failed to update tour" },
      { status: 500 },
    );
  }
}

/* =======================
   DELETE TOUR
======================= */
export async function DELETE(req) {
  try {
    console.log("🗑️ DELETE /admin/tours");

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    console.log("🆔 ID received:", id);

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    let imageUrl = null;

    try {
      const body = await req.json();
      imageUrl = body.imageUrl;
      console.log("🖼️ Image URL:", imageUrl);
    } catch (e) {
      console.log("⚠️ No body provided for delete");
    }

    // delete image if exists
    if (imageUrl && imageUrl.includes("ufs.sh")) {
      try {
        const fileKey = imageUrl.split("/").pop();
        console.log("🧹 Deleting file:", fileKey);

        if (fileKey) {
          await utapi.deleteFiles(fileKey);
        }
      } catch (err) {
        console.error("UploadThing delete error:", err);
      }
    }

    await db.delete(tours).where(eq(tours.id, parseInt(id, 10)));

    console.log("✅ Tour deleted");

    return NextResponse.json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Error:", error);

    return NextResponse.json(
      { error: "Failed to delete tour" },
      { status: 500 },
    );
  }
}
