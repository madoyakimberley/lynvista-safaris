"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import BookingsTable from "./bookings-table";

export default function BookingsClient({ initialBookings }) {
  const [bookings, setBookings] = useState(initialBookings || []);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sentQuotations, setSentQuotations] = useState({});

  async function refresh() {
    try {
      const res = await fetch("/api/admin/bookings", { cache: "no-store" });
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to refresh bookings:", error);
      setBookings([]);
    }
  }

  useEffect(() => {
    refresh(); // initial load
  }, []);

  const filtered = (bookings || [])
    .filter((b) =>
      (b.full_name || "").toLowerCase().includes(search.toLowerCase()),
    )
    .filter((b) => (filter === "All" ? true : b.payment_status === filter));

  async function markPaid(id) {
    try {
      const res = await fetch("/api/admin/bookings/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to mark as paid");
      await refresh();
    } catch (error) {
      console.error("Error marking paid:", error);
    }
  }

  async function deleteBooking(id) {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete booking");
      await refresh();
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  }

  async function sendPaymentLink(
    id,
    quoted_price,
    items,
    email,
    payment_method,
    currency,
  ) {
    if (!id || !quoted_price || !items || !email || !payment_method) {
      alert("Missing required fields before sending.");
      return;
    }

    try {
      const res = await fetch("/api/admin/bookings/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          quoted_price,
          items,
          email,
          currency,
          payment_method,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Quotation sent! Client can now pay via " + payment_method);
        // Logic to show "Client Chose Card" in the UI
        setSentQuotations((prev) => ({
          ...prev,
          [id]: `Sent: ${payment_method}`,
        }));
        await refresh();
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="min-h-screen p-4 md:p-12 text-(--color-dark) bg-(--color-light)">
      <h1 className="text-4xl font-heading mb-12 text-(--color-primary)">
        Manage Bookings
      </h1>

      <div className="max-w-2xl space-y-8 mb-12">
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold">Search Client</label>
          <div className="flex">
            <input
              placeholder="Search name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border px-4 py-3 rounded-full shadow-sm focus:ring-2 focus:ring-(--color-primary)"
            />
            <button className="px-5 bg-(--color-primary-light) text-white rounded-full ml-2 flex items-center justify-center">
              <Search size={22} />
            </button>
          </div>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full border px-4 py-3 rounded-full shadow-sm focus:ring-2 focus:ring-(--color-primary)"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Quotation Sent">Quotation Sent</option>
          <option value="Paid">Paid</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <BookingsTable
        bookings={filtered}
        markPaid={markPaid}
        deleteBooking={deleteBooking}
        sendPaymentLink={sendPaymentLink}
        sentQuotations={sentQuotations}
      />
    </div>
  );
}
