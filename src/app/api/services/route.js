import { NextResponse } from "next/server";

let services = [];

export async function GET() {
  return NextResponse.json(services);
}

export async function POST(req) {
  try {
    const body = await req.json();

    const newService = {
      id: Date.now(),
      ...body,
    };

    services.push(newService);

    return NextResponse.json(newService);
  } catch (error) {
    return NextResponse.json(
      { message: "Service creation failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  services = services.filter((service) => service.id != id);

  return NextResponse.json({ message: "Service deleted" });
}
