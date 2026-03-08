"use client";

import { useState } from "react";

export default function PaymentCards({ bookings }) {
  const [done, setDone] = useState([]);

  const markDone = (id) => {
    setDone([...done, id]);
  };

  const pendingBookings = bookings.filter((b) => !done.includes(b.id));
  const doneBookings = bookings.filter((b) => done.includes(b.id));

  return (
    <div className="space-y-16">
      {/* ================= PENDING ================= */}
      <div>
        <h2
          className="text-2xl font-heading font-bold mb-6"
          style={{ color: "var(--color-dark)" }}
        >
          Pending Management
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pendingBookings.map((b) => (
            <div
              key={b.id}
              className="rounded-xl shadow p-6 space-y-4 border"
              style={{
                background: "white",
                borderColor: "#e7e3da",
                color: "var(--color-dark)",
              }}
            >
              <h3 className="text-lg font-bold">{b.full_name}</h3>

              <div
                className="text-sm space-y-1"
                style={{ color: "var(--color-dark-muted)" }}
              >
                <p>
                  <strong>Email:</strong> {b.email}
                </p>

                <p>
                  <strong>Phone:</strong> {b.phone}
                </p>

                <p>
                  <strong>Tour:</strong> {b.tour_package}
                </p>

                <p>
                  <strong>Travelers:</strong> {b.travelers}
                </p>

                <p>
                  <strong>Payment Status:</strong> {b.payment_status}
                </p>

                <p>
                  <strong>Travel Date:</strong> {b.travel_date}
                </p>

                <p>
                  <strong>Special Requests:</strong>{" "}
                  {b.special_requests ||
                    b.special_request ||
                    b.requests ||
                    "None"}
                </p>
              </div>

              <button
                onClick={() => markDone(b.id)}
                className="px-4 py-2 rounded text-sm font-medium transition"
                style={{
                  background: "var(--color-primary-green)",
                  color: "white",
                }}
              >
                Done Management
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DONE ================= */}
      <div>
        <h2
          className="text-2xl font-heading font-bold mb-6"
          style={{ color: "var(--color-dark)" }}
        >
          Completed Management
        </h2>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {doneBookings.map((b) => (
            <div
              key={b.id}
              className="rounded-xl p-6 border"
              style={{
                background: "var(--color-light)",
                borderColor: "#e7e3da",
                color: "var(--color-dark)",
              }}
            >
              <h3 className="font-bold">{b.full_name}</h3>

              <p className="text-sm">Tour: {b.tour_package}</p>

              <p className="text-sm">Travelers: {b.travelers}</p>

              <p className="text-sm">Payment: {b.payment_status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
