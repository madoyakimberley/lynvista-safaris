"use client";

import { useState } from "react";
import {
  X,
  Download,
  Mail,
  CheckCircle,
  RotateCcw,
  Trash2,
  Users,
  Calendar,
  Phone,
  Clock,
} from "lucide-react";

export default function BookingModal({
  booking,
  onClose,
  onToggleStatus,
  onDeleteBooking,
  onDownloadReceipt,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleStatus = async () => {
    setIsLoading(true);
    const newStatus =
      booking.managed_status === "Managed" ? "Pending" : "Managed";
    await onToggleStatus(booking.id, newStatus);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await onDeleteBooking(booking.id);
  };

  const handleDownloadReceipt = () => {
    onDownloadReceipt(booking);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-center-0 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Background Image */}
          <div
            className="h-24 bg-gradient-to-r"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #442c23 0%, #8b6f47 100%)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Traveler Header */}
            <div className="flex items-start justify-between border-b border-[#e7e3da] pb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
                  style={{ backgroundColor: "#442c23" }}
                >
                  {booking.full_name.charAt(0)}
                  {booking.full_name.split(" ")[1]?.charAt(0) || ""}
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "#442c23" }}
                  >
                    {booking.full_name}
                  </h2>
                  <p style={{ color: "#8b6f47" }}>{booking.email}</p>
                  <p
                    style={{ color: "#8b6f47" }}
                    className="flex items-center gap-2 mt-1"
                  >
                    <Phone size={16} /> {booking.phone}
                  </p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold px-4 py-2 rounded-full ${
                  booking.managed_status === "Managed"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {booking.managed_status === "Managed" ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle size={16} /> PAID
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock size={16} /> PENDING
                  </span>
                )}
              </span>
            </div>

            {/* Package & Stay */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: "#8b6f47" }}
                >
                  Package & Stay
                </h3>
                <div className="space-y-3">
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#442c23" }}
                    >
                      {booking.tour_package}
                    </p>
                    <p className="text-xs" style={{ color: "#8b6f47" }}>
                      Accommodation: {booking.accommodation_type}
                    </p>
                  </div>
                  {booking.accommodation_type && (
                    <div className="bg-[#f5f1e8] rounded-lg p-4 border border-[#e7e3da]">
                      <p
                        className="text-xs font-semibold mb-2"
                        style={{ color: "#8b6f47" }}
                      >
                        STAY DETAILS
                      </p>
                      <p className="text-sm" style={{ color: "#442c23" }}>
                        {booking.accommodation_type}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Travelers & Dates */}
              <div className="space-y-4">
                <div>
                  <h3
                    className="text-xs font-bold uppercase tracking-widest mb-4"
                    style={{ color: "#8b6f47" }}
                  >
                    Travel Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users size={20} style={{ color: "#442c23" }} />
                      <div>
                        <p className="text-xs" style={{ color: "#8b6f47" }}>
                          TRAVELERS
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: "#442c23" }}
                        >
                          {booking.adults || 0} Adults, {booking.children || 0}{" "}
                          Children
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={20} style={{ color: "#442c23" }} />
                      <div>
                        <p className="text-xs" style={{ color: "#8b6f47" }}>
                          DATES
                        </p>
                        <p
                          className="font-semibold"
                          style={{ color: "#442c23" }}
                        >
                          {booking.travel_start_date} –{" "}
                          {booking.travel_end_date}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Booking Value */}
            <div
              className="rounded-xl p-6 text-white"
              style={{ backgroundColor: "#442c23" }}
            >
              <p className="text-xs font-semibold uppercase opacity-90 mb-3">
                Total Booking Value
              </p>
              <h2 className="text-4xl font-bold mb-4">
                KES {(booking.total_price || 0).toLocaleString()}
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span>{booking.payment_status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{booking.payment_method || "Card"}</span>
                </div>
                {booking.payment_method && (
                  <div className="flex justify-between text-xs opacity-75">
                    <span>Transaction ID:</span>
                    <span>#TRX-{booking.id}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                <span className="opacity-90">Transaction Complete</span>
              </div>
            </div>

            {/* Additional Details */}
            {(booking.flight_type || booking.notes || booking.admin_notes) && (
              <div className="space-y-4 border-t border-[#e7e3da] pt-6">
                {booking.flight_type && (
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: "#8b6f47" }}
                    >
                      Flight Type
                    </p>
                    <p style={{ color: "#442c23" }}>{booking.flight_type}</p>
                  </div>
                )}
                {booking.notes && (
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: "#8b6f47" }}
                    >
                      Special Requests
                    </p>
                    <p style={{ color: "#442c23" }}>{booking.notes}</p>
                  </div>
                )}
                {booking.admin_notes && (
                  <div className="bg-[#f5f1e8] rounded-lg p-4 border border-[#e7e3da]">
                    <p
                      className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: "#8b6f47" }}
                    >
                      Admin Notes
                    </p>
                    <p style={{ color: "#442c23" }}>{booking.admin_notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 border-t border-[#e7e3da] pt-6">
              <button
                onClick={handleDownloadReceipt}
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-lg font-semibold transition duration-200 border-2 text-center flex items-center justify-center gap-2"
                style={{
                  borderColor: "#442c23",
                  color: "#442c23",
                  backgroundColor: "white",
                }}
              >
                <Download size={18} /> Download Receipt
              </button>

              <button
                onClick={() => window.open(`mailto:${booking.email}`)}
                className="w-full px-6 py-3 rounded-lg font-semibold transition duration-200 border-2 text-center flex items-center justify-center gap-2"
                style={{
                  borderColor: "#d4a574",
                  color: "#442c23",
                  backgroundColor: "#f5f1e8",
                }}
              >
                <Mail size={18} /> Email Traveler
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleToggleStatus}
                  disabled={isLoading}
                  className="px-4 py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor:
                      booking.managed_status === "Managed"
                        ? "#6b7280"
                        : "#16a34a",
                    color: "white",
                  }}
                >
                  {booking.managed_status === "Managed" ? (
                    <>
                      <RotateCcw size={16} /> Revert
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} /> Mark Managed
                    </>
                  )}
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-4 py-3 rounded-lg font-semibold transition duration-200 bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
