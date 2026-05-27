"use client";

export default function PaymentCards({ bookings }) {
  const pending = bookings.filter((b) => b.managed_status !== "Managed");
  const managed = bookings.filter((b) => b.managed_status === "Managed");

  // ===================== API ACTIONS =====================
  const toggleStatus = async (id, newStatus) => {
    await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "update-status",
        id,
        managed_status: newStatus,
      }),
    });
    window.location.reload();
  };

  const deleteBooking = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
    window.location.reload();
  };

  const cardStyle = "rounded-xl shadow p-6 space-y-3 border border-[#e7e3da]";
  const textDark = { color: "var(--color-dark)" };
  const textMuted = { color: "var(--color-dark-muted)" };

  return (
    <div className="space-y-16">
      {/* ================= PENDING ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={textDark}>
          Pending Management
        </h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pending.map((b) => (
            <div key={b.id} className={`${cardStyle} bg-white`}>
              <h3 className="text-lg font-bold" style={textDark}>
                {b.full_name}
              </h3>
              <div className="text-sm space-y-1" style={textMuted}>
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
                  <strong>Travelers:</strong> {b.adults || 0} Adults,{" "}
                  {b.children || 0} Children
                </p>
                <p>
                  <strong>Dates:</strong> {b.travel_start_date} –{" "}
                  {b.travel_end_date}
                </p>
                <p>
                  <strong>Accom:</strong> {b.accommodation_type}
                </p>
                <p>
                  <strong>Flight:</strong> {b.flight_type}
                </p>
                <p>
                  <strong>Notes:</strong> {b.notes || "None"}
                </p>
              </div>
              <button
                onClick={() => toggleStatus(b.id, "Managed")}
                className="w-full bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-800 transition mt-2"
              >
                Mark as Managed
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= COMPLETED / MANAGED ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={textDark}>
          Completed Management
        </h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {managed.map((b) => (
            <div key={b.id} className={`${cardStyle} bg-[#f3f2e8]`}>
              <h3 className="font-bold" style={textDark}>
                {b.full_name}
              </h3>
              <div className="text-sm space-y-1" style={textMuted}>
                <p>
                  <strong>Tour:</strong> {b.tour_package}
                </p>
                <p>
                  <strong>Status:</strong> Fully Managed
                </p>
                <p>
                  <strong>Payment Status:</strong> {b.payment_status}
                </p>
                <p>
                  <strong>Admin Notes:</strong> {b.admin_notes || "None"}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => toggleStatus(b.id, "Pending")}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 transition"
                >
                  Revert
                </button>
                <button
                  onClick={() => deleteBooking(b.id)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
