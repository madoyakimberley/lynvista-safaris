"use client";

export default function PaymentCards({ bookings }) {
  const pending = bookings.filter((b) => b.managed_status === "Pending");
  const managed = bookings.filter((b) => b.managed_status === "Managed");

  // ===================== UPDATE STATUS =====================
  const toggleStatus = async (id, newStatus) => {
    await fetch("/api/admin/bookings", {
      method: "PUT", // <-- changed PATCH to PUT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, managed_status: newStatus }),
    });
    window.location.reload();
  };

  // ===================== DELETE INDIVIDUAL =====================
  const deleteBooking = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    await fetch("/api/admin/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    window.location.reload();
  };

  // ===================== CLEAR ALL MANAGED =====================
  const clearAllManaged = async () => {
    if (!confirm("Are you sure you want to delete ALL managed bookings?"))
      return;
    for (const b of managed) {
      await fetch("/api/admin/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id }),
      });
    }
    window.location.reload();
  };

  // ===================== PAYSTACK PAYMENT (Admin) =====================
  const triggerPaystack = async (id) => {
    try {
      const res = await fetch("/api/admin/bookings/paystack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });
      const data = await res.json();
      if (data.payment_url) {
        window.open(data.payment_url, "_blank");
      } else {
        alert("Paystack initialization failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to Paystack.");
    }
  };

  // ===================== STYLES =====================
  const cardStyle = "rounded-xl shadow p-6 space-y-3 border border-[#e7e3da]";
  const textDark = { color: "var(--color-dark)" };
  const textMuted = { color: "var(--color-dark-muted)" };

  return (
    <div className="space-y-16">
      {/* ================= PENDING ================= */}
      <div>
        <h2 className="text-2xl font-heading font-bold mb-6" style={textDark}>
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
                  <strong>Travelers:</strong> {b.adults} Adults, {b.children}{" "}
                  Children
                </p>
                <p>
                  <strong>Dates:</strong> {b.travel_start_date} to{" "}
                  {b.travel_end_date}
                </p>
                <p>
                  <strong>Accom:</strong> {b.accommodation_type}
                </p>
                <p>
                  <strong>Flight:</strong> {b.flight_type}
                </p>
              </div>

              {/* ================= BUTTONS ================= */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => toggleStatus(b.id, "Managed")}
                  className="w-full bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-800 transition"
                >
                  Mark as Managed
                </button>

                <button
                  onClick={() => triggerPaystack(b.id)}
                  className="w-full bg-yellow-500 text-black px-4 py-2 rounded text-sm font-semibold hover:bg-yellow-600 transition"
                >
                  Send Paystack Payment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= COMPLETED / MANAGED ================= */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold" style={textDark}>
            Completed Management
          </h2>
          {managed.length > 0 && (
            <button
              onClick={clearAllManaged}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition"
            >
              Clear All
            </button>
          )}
        </div>
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
                  <strong>Adults:</strong> {b.adults} |{" "}
                  <strong>Children:</strong> {b.children}
                </p>
                <p>
                  <strong>Status:</strong> Fully Managed
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => toggleStatus(b.id, "Pending")}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 transition"
                >
                  Revert to Pending
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
