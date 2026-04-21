"use client";

import { Trash2, FileText, CreditCard } from "lucide-react";

export default function BookingsTable({
  bookings = [],
  markPaid,
  deleteBooking,
  sendPaymentLink,
}) {
  return (
    <div className="text-[#2d1b0b] overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-225">
        <thead>
          <tr className="text-[13px] font-bold uppercase border-b-2 border-[#2d5016]/20 text-[#5c3d2e]">
            <th className="pb-4 pr-4">Client</th>
            <th className="pb-4 px-4">Tour / Package</th>
            <th className="pb-4 px-4">Quote</th>
            <th className="pb-4 px-4 text-center">Method</th>
            <th className="pb-4 px-4 text-center">Status</th>
            <th className="pb-4 pl-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[#2d1b0b]/10">
          {bookings.length > 0 ? (
            bookings.map((b) => {
              const isSent =
                b.payment_status === "Quotation Sent" ||
                b.payment_status === "Paid";

              return (
                <tr
                  key={b.id}
                  className="text-sm hover:bg-[#2d5016]/5 transition"
                >
                  <td className="py-5 pr-4 font-bold">{b.full_name}</td>

                  <td className="py-5 px-4">
                    {b.tour_package || "Custom Inquiry"}
                  </td>

                  <td className="py-5 px-4 font-mono">
                    {b.quoted_price
                      ? `${b.currency} ${Number(b.quoted_price).toLocaleString()}`
                      : "—"}
                  </td>

                  <td className="py-5 px-4 text-center text-xs font-medium">
                    {b.payment_method || "Not Set"}
                  </td>

                  <td className="py-5 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        b.payment_status === "Paid"
                          ? "bg-[#2d5016] text-white"
                          : "bg-[#fbbf24] text-[#2d1b0b]"
                      }`}
                    >
                      {b.payment_status}
                    </span>
                  </td>

                  <td className="py-5 pl-4 text-right">
                    <div className="flex gap-2 justify-end items-center">
                      <button
                        onClick={() => sendPaymentLink(b)}
                        className={`px-4 py-1.5 rounded-full text-white text-xs font-bold ${
                          isSent ? "bg-[#5c3d2e]" : "bg-[#2d5016]"
                        }`}
                      >
                        <FileText size={14} className="inline mr-1" />
                        {isSent ? "RESEND" : "QUOTE"}
                      </button>

                      <button
                        onClick={() => markPaid(b.id)}
                        disabled={b.payment_status === "Paid"}
                        className="bg-[#fbbf24] text-[#2d1b0b] px-4 py-1.5 rounded-full text-xs font-bold disabled:opacity-50"
                      >
                        <CreditCard size={14} className="inline mr-1" />
                        PAID
                      </button>

                      <button
                        onClick={() => deleteBooking(b.id)}
                        className="text-red-600 p-2 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="6"
                className="py-12 text-center text-gray-400 italic"
              >
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
