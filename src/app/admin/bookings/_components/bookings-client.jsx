"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import BookingsTable from "./bookings-table";

export default function BookingsClient({ initialBookings }) {
  const [bookings, setBookings] = useState(initialBookings || []);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  async function refresh() {
    try {
      const res = await fetch("/api/admin/bookings", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) setBookings(data);
    } catch (error) {
      console.error("Failed to refresh bookings", error);
    }
  }

  const filtered = bookings
    .filter((b) =>
      (b.full_name || "").toLowerCase().includes(search.toLowerCase()),
    )
    .filter((b) => (filter === "All" ? true : b.payment_status === filter));

  async function markPaid(id) {
    try {
      await fetch("/api/admin/bookings/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await refresh();
    } catch (error) {
      console.error("Error marking paid", error);
    }
  }

  async function cancelBooking(id) {
    try {
      await fetch("/api/admin/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });
      await refresh();
    } catch (error) {
      console.error("Error cancelling booking", error);
    }
  }

  async function deleteBooking(id) {
    try {
      await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
      await refresh();
    } catch (error) {
      console.error("Error deleting booking", error);
    }
  }

  async function sendPaymentLink(
    id,
    quoted_price,
    payment_method,
    items,
    email,
    currency,
  ) {
    try {
      const res = await fetch("/api/admin/bookings/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          quoted_price,
          payment_method,
          items,
          email,
          currency,
        }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = data.paymentLink; // Redirect to Paystack
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Failed to process quote", error);
    }
  }

  return (
    <div className="bg-[#faf8f3] min-h-screen p-4 md:p-12 text-[#2d1b0b]">
      <h1 className="text-4xl font-heading mb-12 text-[#2d5016]">
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
              className="w-full border border-[#5c3d2e]/30 bg-white text-[#2d1b0b] rounded-l-md px-4 py-3 focus:outline-none focus:border-[#fbbf24]"
            />
            <button className="bg-[#fbbf24] px-5 rounded-r-md text-[#2d1b0b] font-bold hover:bg-[#d97706] transition-colors">
              <Search size={22} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold">Payment Status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full border border-[#5c3d2e]/30 bg-white text-[#2d1b0b] rounded-md px-4 py-3 focus:outline-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Quotation Sent">Quotation Sent</option>
            <option value="Paid">Paid</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <BookingsTable
        bookings={filtered}
        markPaid={markPaid}
        cancelBooking={cancelBooking}
        deleteBooking={deleteBooking}
        sendPaymentLink={sendPaymentLink}
        setBookings={setBookings}
      />
    </div>
  );
}
