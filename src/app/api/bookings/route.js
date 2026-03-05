import { NextResponse } from "next/server";

let bookings = [];

export async function POST(req) {
  try {
    const body = await req.json();

    const newBooking = {
      id: Date.now(),
      ...body,
      createdAt: new Date(),
    };

    bookings.push(newBooking);

    return NextResponse.json({
      message: "Booking created",
      booking: newBooking,
    });
  } catch (error) {
    return NextResponse.json({ message: "Booking failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(bookings);
}
