"use client";

import { useState } from "react";
import { Clock, CheckCircle, Trash2, Download, Mail } from "lucide-react";
import BookingModal from "../../payments/_components/booking-modal";
import StatCard from "../../payments/_components/stat-card";

export default function PaymentCards({ bookings = [] }) {
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Handle undefined or null bookings
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  // Calculate stats
  const pendingPayments = safeBookings.filter(
    (b) => b.managed_status !== "Managed",
  ).length;
  const managedBookings = safeBookings.filter(
    (b) => b.managed_status === "Managed",
  ).length;

  const showNotification = (message, type = "success") => {
    const toast = document.createElement("div");

    // Theme logic
    const baseClasses =
      "fixed top-4 right-4 px-6 py-4 rounded-lg font-semibold border z-[9999] animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-2";
    const themeClasses =
      type === "success"
        ? "bg-white text-green-600 border-green-600"
        : "bg-white text-red-600 border-red-600";

    toast.className = `${baseClasses} ${themeClasses}`;

    // Add icon based on type
    toast.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${
              type === "success"
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
            }
        </svg>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

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

  const downloadReceipt = async (booking) => {
    try {
      // Format the receipt as text/html for download
      const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f1e8; padding: 20px; }
    .receipt { background: white; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #442c23; padding-bottom: 20px; }
    .logo { font-size: 28px; font-weight: bold; color: #442c23; margin-bottom: 10px; }
    .subtitle { color: #8b6f47; font-size: 14px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 12px; font-weight: 600; color: #442c23; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; color: #442c23; }
    .info-label { font-weight: 500; }
    .info-value { color: #8b6f47; }
    .divider { height: 1px; background: #e7e3da; margin: 20px 0; }
    .total-section { background: #442c23; color: white; padding: 20px; border-radius: 8px; margin-top: 30px; }
    .total-row { display: flex; justify-content: space-between; font-size: 16px; margin-bottom: 8px; }
    .total-amount { font-size: 32px; font-weight: bold; margin-top: 10px; }
    .transaction-id { text-align: center; color: #8b6f47; font-size: 12px; margin-top: 20px; }
    .footer { text-align: center; color: #8b6f47; font-size: 12px; margin-top: 30px; border-top: 1px solid #e7e3da; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <div class="logo">Safari Booking Receipt</div>
      <div class="subtitle">Transaction Complete</div>
    </div>

    <div class="section">
      <div class="section-title">Traveler Information</div>
      <div class="info-row">
        <span class="info-label">Name:</span>
        <span class="info-value">${booking.full_name}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Email:</span>
        <span class="info-value">${booking.email}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Phone:</span>
        <span class="info-value">${booking.phone}</span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="section">
      <div class="section-title">Booking Details</div>
      <div class="info-row">
        <span class="info-label">Package:</span>
        <span class="info-value">${booking.tour_package}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Accommodation:</span>
        <span class="info-value">${booking.accommodation_type}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Flight:</span>
        <span class="info-value">${booking.flight_type}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Duration:</span>
        <span class="info-value">${booking.travel_start_date} to ${booking.travel_end_date}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Travelers:</span>
        <span class="info-value">${booking.adults || 0} Adults, ${booking.children || 0} Children</span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="total-section">
      <div class="total-row">
        <span>Payment Method:</span>
        <span>${booking.payment_method || "Card"}</span>
      </div>
      <div class="total-row">
        <span>Payment Status:</span>
        <span>${booking.payment_status}</span>
      </div>
      <div class="total-amount">KES ${(booking.total_price || 0).toLocaleString()}</div>
    </div>

    <div class="transaction-id">Transaction ID: #TRX-${booking.id}</div>
    <div class="footer">
      <p>Thank you for your booking. A copy of this receipt has been sent to your email.</p>
      <p style="margin-top: 10px;">Generated on ${new Date().toLocaleDateString()}</p>
    </div>
  </div>
</body>
</html>
      `;

      // Create and download as HTML file
      const blob = new Blob([receiptHTML], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${booking.id}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showNotification("Receipt downloaded successfully!", "success");
    } catch (error) {
      console.error("Error downloading receipt:", error);
      showNotification("Failed to download receipt", "error");
    }
  };

  const textDark = { color: "#442c23" };
  const textMuted = { color: "#8b6f47" };

  return (
    <div className="space-y-12">
      {/* ================= STATS SECTION ================= */}
      <div className="grid md:grid-cols-2 gap-6">
        <StatCard
          icon={Clock}
          label="Pending Payments"
          value={`${pendingPayments}`}
          badge={`${pendingPayments} Awaiting Management`}
          borderColor="#d4a574"
        />
        <StatCard
          icon={CheckCircle}
          label="Managed Bookings"
          value={`${managedBookings}`}
          badge={`${managedBookings} Fully Managed`}
          borderColor="#6b9f6f"
        />
      </div>

      {/* ================= RECENT PAYMENTS GRID ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={textDark}>
          Recent Payments
        </h2>
        {safeBookings.length === 0 ? (
          <div
            className="p-8 border-2 border-dashed border-[#e7e3da] rounded-xl text-center"
            style={textMuted}
          >
            <p className="text-lg">No bookings found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {safeBookings.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className="group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border border-[#e7e3da]"
              >
                {/* Background image - subtle */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Cpath d=%22M0 0 Q 25 50 50 50 T 100 50%22 fill=%22none%22 stroke=%22%23442c23%22 stroke-width=%220.5%22/%3E%3C/svg%3E')",
                    backgroundRepeat: "repeat",
                  }}
                />

                {/* Card Content */}
                <div className="relative bg-white p-6 space-y-4 z-10">
                  {/* Avatar and Name */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: "#442c23" }}
                      >
                        {b.full_name.charAt(0)}
                        {b.full_name.split(" ")[1]?.charAt(0) || ""}
                      </div>
                      <div>
                        <h3 className="font-semibold" style={textDark}>
                          {b.full_name}
                        </h3>
                        <p className="text-xs" style={textMuted}>
                          {b.email}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        b.managed_status === "Managed"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {b.managed_status === "Managed" ? "PAID" : "PENDING"}
                    </span>
                  </div>

                  {/* Package Info */}
                  <div className="pt-2 border-t border-[#e7e3da]">
                    <p className="text-xs" style={textMuted}>
                      SAFARI PACKAGE
                    </p>
                    <p className="font-semibold text-sm" style={textDark}>
                      {b.tour_package}
                    </p>
                  </div>

                  {/* Click to View */}
                  <div className="text-center pt-2">
                    <p className="text-xs text-[#d4a574] font-medium group-hover:underline">
                      Click to view details →
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onToggleStatus={toggleStatus}
          onDeleteBooking={deleteBooking}
          onDownloadReceipt={downloadReceipt}
        />
      )}
    </div>
  );
}
