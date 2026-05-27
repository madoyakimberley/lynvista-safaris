"use client";

import { Check, X } from "lucide-react";

export default function PaymentTable({ bookings }) {
  const updatePaymentStatus = async (id, status) => {
    await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update-payment",
        id,
        payment_status: status,
      }),
    });
    window.location.reload();
  };

  return (
    <div className="p-6 rounded-xl shadow bg-white">
      <h2 className="text-xl font-bold mb-6">Payment Status</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="py-2">Name</th>
            <th className="py-2">Tour</th>
            <th className="py-2">Status</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b">
              <td className="py-3">{b.full_name}</td>
              <td className="py-3">{b.tour_package}</td>
              <td className="py-3 font-semibold">{b.payment_status}</td>
              <td className="flex gap-2 py-3">
                <button
                  onClick={() => updatePaymentStatus(b.id, "Paid")}
                  className="p-2 rounded bg-green-600 text-white"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => updatePaymentStatus(b.id, "Cancelled")}
                  className="p-2 rounded bg-red-600 text-white"
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
