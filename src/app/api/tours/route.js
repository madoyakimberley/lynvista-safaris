import { NextResponse } from "next/server";

let tours = [];

export async function GET() {
  return NextResponse.json(tours);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const newTour = {
      id: Date.now(),
      ...body,
    };

    tours.push(newTour);

    return NextResponse.json(newTour);
  } catch (error) {
    return NextResponse.json(
      { message: "Tour creation failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  tours = tours.filter((tour) => tour.id != id);

  return NextResponse.json({ message: "Tour deleted" });
}
