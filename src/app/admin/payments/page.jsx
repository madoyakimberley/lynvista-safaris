import { db } from "@/app/db/db";
import { bookings } from "@/app/db/schema";
import PaymentCards from "../_components/tables/payment-cards";

export default async function PaymentsPage() {
  const data = await db.select().from(bookings);

  return (
    <div className="space-y-10">
      <h1
        className="text-3xl font-heading font-bold"
        style={{ color: "var(--color-dark)" }}
      >
        Payments Management
      </h1>

      <PaymentCards bookings={data} />
    </div>
  );
}
