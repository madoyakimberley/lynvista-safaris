import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import BookingsClient from "./_components/bookings-client";

export default async function BookingsPage() {
  const data = await db.select().from(bookings).orderBy(bookings.created_at);

  return (
    <div className="space-y-8">
      <BookingsClient initialBookings={data} />
    </div>
  );
}
