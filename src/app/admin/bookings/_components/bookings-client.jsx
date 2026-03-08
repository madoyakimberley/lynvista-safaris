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
      const res = await fetch("/api/admin/bookings", {
        cache: "no-store",
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setBookings(data);
      }
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
        headers: {
          "Content-Type": "application/json",
        },
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      await refresh();
    } catch (error) {
      console.error("Error cancelling booking", error);
    }
  }

  async function deleteBooking(id) {
    try {
      await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });

      await refresh();
    } catch (error) {
      console.error("Error deleting booking", error);
    }
  }

  return (
    <div className="bg-(--color-light) rounded-sm min-h-screen p-4 md:p-12">
      {/* HEADER */}
      <h1 className="text-4xl font-heading text-(--color-dark) mb-12">
        Manage Bookings
      </h1>

      {/* SEARCH + FILTER */}
      <div className="max-w-2xl space-y-8 mb-12">
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-(--color-dark)">
            Search Client
          </label>

          <div className="flex">
            <input
              placeholder="Search name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-l-md px-4 py-3 focus:outline-none text-(--color-dark) bg-transparent"
            />

            <button className="bg-(--color-primary) px-5 rounded-r-md text-white hover:opacity-90 transition-opacity">
              <Search size={22} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-(--color-dark)">
            Payment Status
          </label>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-(--color-dark) bg-white focus:outline-none appearance-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <BookingsTable
        bookings={filtered}
        markPaid={markPaid}
        cancelBooking={cancelBooking}
        deleteBooking={deleteBooking}
      />
    </div>
  );
}
