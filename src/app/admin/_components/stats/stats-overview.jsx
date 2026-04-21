"use client";

import { useEffect, useState } from "react";
import { Package, DollarSign, Calendar } from "lucide-react";

export default function StatsOverview() {
  const [bookings, setBookings] = useState([]);

  async function loadBookings() {
    try {
      const res = await fetch("/api/admin/bookings", {
        cache: "no-store",
      });

      const result = await res.json();

      // ✅ FIX: Access the 'data' array inside the response object
      // Also handle the case where it might be a raw array for backward compatibility
      const actualData = Array.isArray(result) ? result : result.data;

      if (Array.isArray(actualData)) {
        setBookings(actualData);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Failed to load bookings", err);
      setBookings([]);
    }
  }

  useEffect(() => {
    loadBookings();

    const interval = setInterval(() => {
      loadBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Compute stats based on the filtered data
  const totalBookings = bookings.length;

  const paidBookings = bookings.filter(
    (b) => b.payment_status === "Paid",
  ).length;

  const pendingBookings = bookings.filter(
    (b) => b.payment_status === "Pending",
  ).length;

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: Calendar,
    },
    {
      title: "Paid Bookings",
      value: paidBookings,
      icon: DollarSign,
    },
    {
      title: "Pending",
      value: pendingBookings,
      icon: Package,
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <div
            key={i}
            className="p-6 rounded-xl shadow"
            style={{ background: "white" }}
          >
            <div className="flex items-center justify-between mb-4">
              <Icon size={28} style={{ color: "var(--color-primary)" }} />
            </div>

            <p style={{ color: "var(--color-dark-muted)" }}>{stat.title}</p>

            <h3
              className="text-3xl font-bold"
              style={{ color: "var(--color-dark)" }}
            >
              {stat.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
}
