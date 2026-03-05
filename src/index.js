import "dotenv/config";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";

import {
  tours,
  services,
  bookings,
  admins,
  tourServices,
  bookingServices,
} from "./app/db/schema.js";

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  const allTours = await db.select().from(tours);
  console.log("Tours:", allTours);

  const allServices = await db.select().from(services);
  console.log("Services:", allServices);

  const userBookings = await db
    .select()
    .from(bookings)
    .where(eq(bookings.email, "test@example.com"));
  console.log("Bookings:", userBookings);

  const allTourServices = await db.select().from(tourServices);
  console.log("Tour Services:", allTourServices);

  const allBookingServices = await db.select().from(bookingServices);
  console.log("Booking Services:", allBookingServices);

  const allAdmins = await db.select().from(admins);
  console.log("Admins:", allAdmins);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
