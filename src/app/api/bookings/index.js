import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";

export async function GET() {
  try {
    const allBookings = await db.select().from(bookings);
    return new Response(JSON.stringify(allBookings), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch bookings" }), {
      status: 500,
    });
  }
}
