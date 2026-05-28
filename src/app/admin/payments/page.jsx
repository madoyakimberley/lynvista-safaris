import { Suspense } from "react";
import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import PaymentCards from "../_components/tables/payment-cards";
import PaymentsSkeleton from "./_components/PaymentsSkeleton";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  // 1. Authentication Check
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) redirect("/admin/login");

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8 space-y-10">
      <h1
        className="text-3xl font-heading font-bold"
        style={{ color: "#442c23" }}
      >
        Payments Management
      </h1>

      {/* Suspense handles the loading state via your skeleton */}
      <Suspense fallback={<PaymentsSkeleton />}>
        <PaymentDataFetcher />
      </Suspense>
    </div>
  );
}

// 2. Data Fetcher Component
async function PaymentDataFetcher() {
  try {
    const data = await db
      .select()
      .from(bookings)
      .where(eq(bookings.payment_status, "Paid"))
      .execute(); // Explicit execution for better stability

    const formattedData = data.map((b) => ({
      ...b,
      travel_start_date:
        b.travel_start_date instanceof Date
          ? b.travel_start_date.toISOString().split("T")[0]
          : b.travel_start_date,
      travel_end_date:
        b.travel_end_date instanceof Date
          ? b.travel_end_date.toISOString().split("T")[0]
          : b.travel_end_date,
    }));

    if (formattedData.length === 0) {
      return (
        <div
          className="p-8 border-2 border-dashed border-[#e7e3da] rounded-xl text-center"
          style={{ color: "#442c23" }}
        >
          <p className="text-lg">No paid bookings currently available.</p>
        </div>
      );
    }

    return <PaymentCards bookings={formattedData} />;
  } catch (dbError) {
    console.error("Database Connection Error:", dbError);
    return (
      <div className="p-8 text-center text-red-600">
        <p>Database connection failed. Please check your database status.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-[#451a03] text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }
}
