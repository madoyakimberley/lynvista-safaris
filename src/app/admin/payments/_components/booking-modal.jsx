"use client";

import { useState } from "react";
import {
  X,
  Download,
  Mail,
  CheckCircle,
  Clock,
  Trash2,
  Calendar,
  Phone,
  ArrowRight,
  User,
  CreditCard,
  CheckCircle2,
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
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await onDeleteBooking(booking.id);
    setIsLoading(false);
  };

  const handleDownloadReceipt = () => {
    onDownloadReceipt(booking);
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "JB";
    const parts = name.split(" ");
    return (parts[0].charAt(0) + (parts[1]?.charAt(0) || "")).toUpperCase();
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C2520]/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div
          className="bg-[#FCF9F5] rounded-[2rem] shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto flex flex-col relative animate-in fade-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Image Cover */}
          <div
            className="h-40 sm:h-48 w-full bg-cover bg-center relative shrink-0"
            style={{
              backgroundImage: "url('/images/Terms.WebP')", // Using your savannah hero asset
              backgroundColor: "#D9772B", // Fallback color
            }}
          >
            {/* Top Right Admin Actions */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={handleDelete}
                disabled={isLoading}
                title="Delete Booking"
                className="bg-white/10 hover:bg-red-500/80 text-white p-2.5 rounded-full backdrop-blur-md transition-colors border border-white/20 shadow-sm"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/30 text-white p-2.5 rounded-full backdrop-blur-md transition-colors border border-white/20 shadow-sm"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Content Body */}
          <div className="px-8 sm:px-12 pb-10">
            {/* Profile Row (Overlapping Header) */}
            <div className="flex flex-col sm:flex-row gap-6 sm:items-end -mt-16 sm:-mt-20 mb-10 relative">
              {/* Avatar Box */}
              <div className="bg-[#FCF9F5] p-2 sm:p-2.5 rounded-[1.5rem] shadow-sm shrink-0 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]">
                <div className="w-full h-full bg-[#FAF4EC] rounded-[1rem] flex items-center justify-center text-[#5C3D2E] text-4xl sm:text-5xl font-serif font-bold">
                  {getInitials(booking.full_name)}
                </div>
              </div>

              {/* Name & Contact Info */}
              <div className="pb-1 flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1a120b]">
                    {booking.full_name}
                  </h2>

                  {/* Styled Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1.5 uppercase shadow-sm border ${
                      booking.managed_status === "Managed"
                        ? "bg-[#bbf7d0] text-[#166534] border-[#86efac]"
                        : "bg-[#fef3c7] text-[#b45309] border-[#fde68a]"
                    }`}
                  >
                    {booking.managed_status === "Managed" ? (
                      <>
                        <CheckCircle2 size={12} strokeWidth={3} /> PAID
                      </>
                    ) : (
                      <>
                        <Clock size={12} strokeWidth={3} /> PENDING
                      </>
                    )}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-[#6E6259]">
                  <a
                    href={`mailto:${booking.email}`}
                    className="flex items-center gap-1.5 hover:text-[#5C3D2E] transition-colors"
                  >
                    <Mail size={14} className="text-[#A89A8B]" />{" "}
                    {booking.email}
                  </a>
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-[#D1C4B4]"></span>
                  <a
                    href={`tel:${booking.phone}`}
                    className="flex items-center gap-1.5 hover:text-[#5C3D2E] transition-colors"
                  >
                    <Phone size={14} className="text-[#A89A8B]" />{" "}
                    {booking.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Grid Layout Container */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              {/* Left Column (Details) */}
              <div className="lg:col-span-3 space-y-8">
                {/* Package & Stay */}
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8b6f47] mb-3">
                    Package & Stay
                  </h3>
                  <div className="bg-[#FAF4EC] rounded-2xl p-4 sm:p-5 flex items-center gap-5 border border-[#EADCC9]/60">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-cover bg-center shrink-0 shadow-sm"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80')",
                      }}
                    />
                    <div>
                      <h4 className="text-[#5C3D2E] font-serif text-lg sm:text-xl font-medium mb-1.5">
                        {booking.tour_package || "Bespoke Safari Experience"}
                      </h4>
                      <p className="text-[#6E6259] text-sm flex items-center gap-1.5 font-medium">
                        <Clock size={14} />{" "}
                        {booking.accommodation_type || "Standard Duration"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Travelers & Dates Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Travelers */}
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8b6f47] mb-3">
                      Travelers
                    </h3>
                    <div className="bg-[#FAF4EC] rounded-2xl p-5 border border-[#EADCC9]/60 h-[88px] flex items-center gap-4">
                      <div className="flex -space-x-2 shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#5C3D2E] flex items-center justify-center text-[#FCF9F5] shadow-sm z-10">
                          <User size={14} />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#fbbf24] border-2 border-[#FAF4EC] flex items-center justify-center text-[#5C3D2E] shadow-sm z-0">
                          <User size={14} />
                        </div>
                      </div>
                      <p className="text-[#2C2520] font-medium text-sm">
                        {booking.adults || 0} Adults, {booking.children || 0}{" "}
                        Child
                      </p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div>
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8b6f47] mb-3">
                      Dates
                    </h3>
                    <div className="bg-[#FAF4EC] rounded-2xl p-5 border border-[#EADCC9]/60 h-[88px] flex items-center gap-3">
                      <Calendar size={18} className="text-[#8b6f47] shrink-0" />
                      <p className="text-[#2C2520] font-medium text-sm">
                        {booking.travel_start_date} –{" "}
                        <br className="sm:hidden" /> {booking.travel_end_date}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Admin Notes / Special Requests (Optional Render) */}
                {(booking.notes || booking.admin_notes) && (
                  <div className="pt-2">
                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#8b6f47] mb-3">
                      Booking Notes
                    </h3>
                    <div className="bg-white rounded-2xl p-5 border border-[#EADCC9]/60 space-y-3">
                      {booking.notes && (
                        <p className="text-sm text-[#6E6259] leading-relaxed">
                          <strong className="text-[#2C2520]">
                            Guest Request:
                          </strong>{" "}
                          {booking.notes}
                        </p>
                      )}
                      {booking.admin_notes && (
                        <p className="text-sm text-[#6E6259] leading-relaxed border-t border-[#EADCC9]/40 pt-3">
                          <strong className="text-[#2C2520]">
                            Internal Note:
                          </strong>{" "}
                          {booking.admin_notes}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column (Dark Total Value Card) */}
              <div className="lg:col-span-2">
                <div className="bg-[#19110B] rounded-[2rem] p-8 sm:p-10 text-white shadow-2xl flex flex-col h-full relative overflow-hidden">
                  {/* Top Section */}
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C6D4F] mb-6">
                      Total Booking Value
                    </p>
                    <p className="text-[#D1C4B4] font-bold text-sm mb-1">KES</p>
                    <h2 className="text-5xl sm:text-6xl font-serif tracking-tight mb-5">
                      {(booking.total_price || 0).toLocaleString()}
                    </h2>

                    <div className="inline-flex items-center gap-2 bg-[#261B12] border border-[#3E2F24] px-4 py-2 rounded-lg text-xs font-medium text-[#EADCC9]">
                      <CheckCircle2 size={14} className="text-[#8C6D4F]" />
                      {booking.payment_status === "Paid"
                        ? "Transaction Complete"
                        : "Pending Payment"}
                    </div>
                  </div>

                  {/* Bottom Section Details */}
                  <div className="mt-10 border-t border-[#3E2F24] pt-6 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#8C6D4F] font-medium">
                        Payment Method
                      </span>
                      <span className="font-semibold flex items-center gap-2 text-[#FCF9F5]">
                        <div className="bg-[#261B12] p-1.5 rounded-md border border-[#3E2F24]">
                          <CreditCard size={14} className="text-[#D1C4B4]" />
                        </div>
                        {booking.payment_method || "Visa •••• 4242"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#8C6D4F] font-medium">
                        Transaction ID
                      </span>
                      <span className="font-semibold text-[#FCF9F5]">
                        #TRX-{booking.id || "882941"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-[#EADCC9]/80">
              {/* Secondary Actions (Email) */}
              <div className="flex w-full sm:w-auto items-center justify-center sm:justify-start">
                <button
                  onClick={() => window.open(`mailto:${booking.email}`)}
                  className="text-[#8b6f47] hover:text-[#2C2520] transition-colors p-3 rounded-full hover:bg-[#FAF4EC] flex items-center gap-2 text-sm font-semibold"
                >
                  <Mail size={18} /> <span>Email Traveler</span>
                </button>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
                <button
                  onClick={handleDownloadReceipt}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold transition duration-200 border-2 border-[#5C3D2E] text-[#5C3D2E] hover:bg-[#FAF4EC] flex items-center justify-center gap-2 text-sm bg-transparent"
                >
                  <Download size={18} /> Download Receipt
                </button>

                <button
                  onClick={handleToggleStatus}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold transition duration-200 bg-[#5A3F1F] hover:bg-[#432E16] text-[#FCF9F5] flex items-center justify-center gap-2 text-sm shadow-md hover:shadow-lg"
                >
                  {booking.managed_status === "Managed"
                    ? "Revert to Pending"
                    : "Mark as Managed"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
