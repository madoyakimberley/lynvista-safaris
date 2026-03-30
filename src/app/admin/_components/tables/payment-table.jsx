"use client";

import { Check, X } from "lucide-react";

export default function PaymentTable({ bookings, refresh }) {
  const updateStatus = async (id, status) => {
    // Update status
    await fetch("/api/admin/bookings/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    // Optional: trigger receipt generation
    await fetch("/api/admin/bookings/receipt", {
      method: "POST",
      body: JSON.stringify({ bookingId: id }),
    });

    // ✅ Safe reload
    window.location.reload();
  };

  // ===================== STYLES =====================
  return (
    <div className="p-6 rounded-xl shadow" style={{ background: "white" }}>
      <h2
        className="text-xl font-heading mb-6"
        style={{ color: "var(--color-dark)" }}
      >
        Payments
      </h2>

      <table className="w-full text-left">
        <thead>
          <tr style={{ borderBottom: "1px solid #eee" }}>
            <th>Name</th>
            <th>Tour</th>
            <th>Travelers</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b">
              <td>{b.full_name}</td>
              <td>{b.tour_package}</td>
              <td>{b.travelers}</td>
              <td>{b.payment_status}</td>
              <td className="flex gap-3 py-3">
                <button
                  onClick={() => updateStatus(b.id, "Paid")}
                  className="p-2 rounded"
                  style={{
                    background: "var(--color-primary)",
                    color: "white",
                  }}
                >
                  <Check size={16} />
                </button>

                <button
                  onClick={() => updateStatus(b.id, "Cancelled")}
                  className="p-2 rounded"
                  style={{
                    background: "#dc2626",
                    color: "white",
                  }}
                >
                  <X size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
