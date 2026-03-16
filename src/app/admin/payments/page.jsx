import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import PaymentCards from "../_components/tables/payment-cards";

export default async function PaymentsPage() {
  const data = await db
    .select()
    .from(bookings)
    .where(eq(bookings.payment_status, "Paid"));

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

  // Style object for consistent Dark Brown branding
  const darkBrown = { color: "#442c23" };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-heading font-bold" style={darkBrown}>
        Payments Management
      </h1>

      {formattedData.length > 0 ? (
        <PaymentCards bookings={formattedData} />
      ) : (
        <div
          className="p-8 border-2 border-dashed border-[#e7e3da] rounded-xl text-center"
          style={darkBrown}
        >
          <p className="text-lg">No paid bookings currently available.</p>
        </div>
      )}
    </div>
  );
}
