"use client";

import { Trash2, FileText, CreditCard } from "lucide-react";

export default function BookingsTable({
  bookings = [],
  markPaid,
  deleteBooking,
  sendPaymentLink,
}) {
  // Helper to generate initials for the avatar circle
  const getInitials = (name) => {
    if (!name) return "TR";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-sm font-bold text-[#2d1b0b] bg-[#2d1b0b]/5 border-b border-[#2d1b0b]/10">
            <th className="py-4 px-6">Client Name</th>
            <th className="py-4 px-6">Destination / Details</th>
            <th className="py-4 px-6">Quote Amount</th>
            <th className="py-4 px-6 text-center">Status</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#2d1b0b]/5 bg-white">
          {bookings.length > 0 ? (
            bookings.map((b) => {
              const isSent =
                b.payment_status === "Quotation Sent" ||
                b.payment_status === "Paid";

              return (
                <tr
                  key={b.id}
                  className="hover:bg-[#faf8f3] transition-colors group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-[#fbbf24]/20 text-[#2d1b0b] flex items-center justify-center font-bold font-serif text-sm">
                        {getInitials(b.full_name)}
                      </div>
                      <div>
                        <p className="font-bold text-[#2d1b0b]">
                          {b.full_name}
                        </p>
                        <p className="text-xs text-gray-500">{b.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <p className="font-medium text-[#2d1b0b]">
                      {b.tour_package || "Custom Safari Inquiry"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Method:{" "}
                      <span className="font-semibold">
                        {b.payment_method || "Not Set"}
                      </span>
                    </p>
                  </td>

                  <td className="py-4 px-6 font-mono font-medium text-[#2d1b0b]">
                    {b.quoted_price
                      ? `${b.currency || "KES"} ${Number(b.quoted_price).toLocaleString()}`
                      : "—"}
                  </td>

                  <td className="py-4 px-6 text-center">
                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        b.payment_status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : b.payment_status === "Quotation Sent"
                            ? "bg-[#fbbf24]/20 text-[#2d1b0b]"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {b.payment_status || "Pending"}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex gap-2 justify-end items-center">
                      <button
                        onClick={() => sendPaymentLink(b)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                          isSent
                            ? "bg-white border border-[#2d1b0b]/20 text-[#2d1b0b] hover:bg-gray-50"
                            : "bg-[#2d1b0b] text-[#fbbf24] hover:bg-black"
                        }`}
                      >
                        <FileText size={14} />
                        {isSent ? "RESEND" : "QUOTE"}
                      </button>

                      <button
                        onClick={() => markPaid(b.id)}
                        disabled={b.payment_status === "Paid"}
                        className="px-4 py-2 flex items-center gap-2 bg-white border border-[#2d1b0b]/20 text-[#2d1b0b] rounded-xl hover:bg-[#fbbf24] hover:border-[#fbbf24] disabled:opacity-30 disabled:hover:bg-white disabled:hover:border-[#2d1b0b]/20 transition-all text-xs font-bold"
                      >
                        <CreditCard size={14} />
                        PAID
                      </button>

                      <button
                        onClick={() => deleteBooking(b.id)}
                        className="px-4 py-2 flex items-center gap-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-xs font-bold"
                      >
                        <Trash2 size={14} />
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="5"
                className="py-12 text-center text-gray-400 font-medium"
              >
                No bookings found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
