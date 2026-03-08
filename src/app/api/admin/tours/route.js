import { db } from "@/app/db/db";
import { tours } from "@/app/db/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const newTour = await db.insert(tours).values(body);

  return NextResponse.json(newTour);
}
