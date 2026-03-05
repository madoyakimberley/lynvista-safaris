import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Replace later with database validation
    if (email === "admin@test.com" && password === "123456") {
      return NextResponse.json({
        admin: {
          id: 1,
          email,
          role: "admin",
        },
      });
    }

    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
