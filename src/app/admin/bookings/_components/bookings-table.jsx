"use client";

export default function BookingsTable({
  bookings,
  markPaid,
  cancelBooking,
  deleteBooking,
}) {
  return (
    <div className="overflow-x-auto mt-16">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[13px] font-bold text-(--color-dark) uppercase tracking-wider border-b-2 border-black">
            <th className="pb-4 pr-4">Client Name</th>
            <th className="pb-4 px-4">Email</th>
            <th className="pb-4 px-4">Tour</th>
            <th className="pb-4 px-4 text-center">Travelers</th>
            <th className="pb-4 px-4 text-center">Payment Status</th>
            <th className="pb-4 pl-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {bookings.map((b) => (
            <tr
              key={b.id}
              className="text-sm text-(--color-dark-muted) hover:bg-black/5 group transition-colors"
            >
              <td className="py-5 pr-4 font-bold text-(--color-dark)">
                {b.full_name}
              </td>

              <td className="py-5 px-4">{b.email}</td>

              <td className="py-5 px-4">{b.tour_package}</td>

              <td className="py-5 px-4 text-center">{b.travelers}</td>

              <td className="py-5 px-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${
                    b.payment_status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : b.payment_status === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {b.payment_status}
                </span>
              </td>

              <td className="py-5 pl-4 text-right">
                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  {b.payment_status !== "Paid" && (
                    <button
                      onClick={() => markPaid(b.id)}
                      className="text-[10px] bg-(--color-primary) text-white px-3 py-1 rounded font-bold uppercase"
                    >
                      Paid
                    </button>
                  )}

                  {b.payment_status !== "Cancelled" && (
                    <button
                      onClick={() => cancelBooking(b.id)}
                      className="text-[10px] bg-(--color-secondary) text-black px-3 py-1 rounded font-bold uppercase"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    onClick={() => deleteBooking(b.id)}
                    className="text-[10px] bg-red-800 text-white px-3 py-1 rounded font-bold uppercase"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {bookings.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-10 text-gray-500">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
