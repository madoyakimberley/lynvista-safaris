import { Suspense } from "react";
import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import BookingsClient from "./_components/bookings-client";
import BookingsSkeleton from "./Skeleton";
import RefreshButton from "../_components/RefreshButton/page";

export default async function BookingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#451a03]">Manage Bookings</h1>
      </div>

      <Suspense fallback={<BookingsSkeleton />}>
        <BookingDataFetcher />
      </Suspense>
    </div>
  );
}

async function BookingDataFetcher() {
  try {
    const data = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.created_at));

    return <BookingsClient initialBookings={data} />;
  } catch (dbError) {
    console.error("Database Connection Error:", dbError);
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-red-600 mb-2">
          Connection Timeout
        </h2>
        <p className="text-gray-600 mb-6">
          The database took too long to respond.
        </p>
        <RefreshButton />
      </div>
    );
  }
}
