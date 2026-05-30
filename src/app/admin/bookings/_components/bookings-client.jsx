"use client";

import { useState, useEffect } from "react";
import {
  Search,
  RefreshCcw,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  DollarSign,
  Smartphone,
  CreditCard,
  Building2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import BookingsTable from "./bookings-table";

export default function BookingsClient({ initialBookings }) {
  const [bookings, setBookings] = useState(() => {
    if (Array.isArray(initialBookings)) return initialBookings;
    if (Array.isArray(initialBookings?.data)) return initialBookings.data;
    return [];
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal & Global Notification States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [quoteItems, setQuoteItems] = useState([
    { name: "Base Package", price: "" },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("M-Pesa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [bankInstructions, setBankInstructions] = useState("");

  // DOM Toast Alert States
  const [toast, setToast] = useState(null);

  // DOM Custom Delete Confirmation States
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const totalAmount = quoteItems.reduce(
    (sum, i) => sum + (Number(i.price) || 0),
    0,
  );

  // Helper to trigger floating DOM notifications
  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  async function refresh() {
    try {
      const res = await fetch("/api/admin/bookings", { cache: "no-store" });
      const result = await res.json();
      setBookings(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      setBookings([]);
      showToast("error", "Could not fetch updated bookings.");
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  // Step 1: Trigger Custom DOM confirmation instead of native window confirm
  const initiateDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  // Step 2: Handle actual execution if confirmed in DOM
  const executeDelete = async () => {
    const id = deleteConfirm.id;
    setDeleteConfirm({ show: false, id: null });
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        refresh();
        showToast("success", "Booking deleted successfully.");
      } else {
        showToast("error", "Failed to delete booking.");
      }
    } catch (err) {
      showToast("error", "Error connecting to server.");
    }
  };

  const markPaid = async (id) => {
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-paid", id }),
      });
      if (res.ok) {
        refresh();
        showToast("success", "Booking marked as Paid.");
      } else {
        showToast("error", "Failed to update payment status.");
      }
    } catch (err) {
      showToast("error", "Error connecting to server.");
    }
  };

  const openQuoteModal = (booking) => {
    console.log("Opening quote modal for booking:", booking);

    setSelectedBooking(booking);
    setBankInstructions("");
    setQuoteItems([
      { name: "Base Package", price: booking.quoted_price || "" },
    ]);

    console.log("Current payment method state:", paymentMethod);

    setIsModalOpen(true);
    setStatusMessage(null);
  };

  const handleSendQuote = async () => {
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/bookings/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedBooking.id,
          quoted_price: totalAmount,
          items: quoteItems,
          email: selectedBooking.email,
          full_name: selectedBooking.full_name,
          currency: selectedBooking.currency || "USD",
          payment_method: paymentMethod,
          payment_instructions:
            paymentMethod === "Bank Transfer" ? bankInstructions : "",
        }),
      });

      if (res.ok) {
        setStatusMessage({ type: "success", text: "Quote sent successfully!" });
        setTimeout(() => setIsModalOpen(false), 2000);
        refresh();
      } else {
        const err = await res.json();
        setStatusMessage({
          type: "error",
          text: err.error || "Failed to send.",
        });
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Connection error." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtering Logic
  const filtered = (Array.isArray(bookings) ? bookings : [])
    .filter((b) =>
      (b.full_name || "").toLowerCase().includes(search.toLowerCase()),
    )
    .filter((b) => (filter === "All" ? true : b.payment_status === filter));

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedBookings = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen p-6 text-[#2d1b0b] bg-[#faf8f3] relative">
      {/* BEAUTIFUL FLOATING TOAST NOTIFICATION CONTAINER */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-medium transition-all max-w-md ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <XCircle size={18} className="text-rose-600 shrink-0" />
            )}
            <p>{toast.text}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors opacity-60"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* BEAUTIFUL CUSTOM DELETE CONFIRMATION DIALOG */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 bg-[#2d1b0b]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 border border-[#2d1b0b]/10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#2d1b0b]">
                Confirm Destructive Action
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you absolutely sure you want to delete this client's
                booking? This processing action cannot be reversed.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3 rounded-xl font-bold transition-colors text-sm border border-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold transition-colors text-sm shadow-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2d1b0b]">Manage Bookings</h1>
        <button
          onClick={refresh}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 flex items-center border border-[#2d1b0b]/10 bg-white rounded-xl px-4">
          <Search size={18} className="opacity-40" />
          <input
            className="p-3 w-full outline-none bg-transparent text-[#2d1b0b]"
            placeholder="Search client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-[#2d1b0b]/10 p-3 rounded-xl bg-white outline-none font-medium text-[#2d1b0b]"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Quotation Sent">Quoted</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#2d1b0b]/10 overflow-hidden">
        <BookingsTable
          bookings={paginatedBookings}
          sendPaymentLink={openQuoteModal}
          markPaid={markPaid}
          deleteBooking={initiateDelete} // Now connects seamlessly into our custom DOM dialogue
        />

        {/* Pagination Controls */}
        {filtered.length > 0 && (
          <div className="p-4 border-t border-[#2d1b0b]/10 flex items-center justify-between text-sm text-gray-500 bg-[#faf8f3]">
            <div>
              Showing{" "}
              <span className="font-bold text-[#2d1b0b]">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-[#2d1b0b]">
                {Math.min(currentPage * itemsPerPage, filtered.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#2d1b0b]">
                {filtered.length}
              </span>{" "}
              bookings
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    currentPage === i + 1
                      ? "bg-[#2d1b0b] text-[#fbbf24]"
                      : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2d1b0b]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-[#faf8f3]">
              <div>
                <h2 className="text-xl font-bold text-[#2d1b0b]">
                  New Quotation
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedBooking?.email}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {statusMessage && (
                <div
                  className={`p-4 rounded-xl text-sm flex items-center gap-2 ${statusMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                >
                  {statusMessage.type === "success" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {statusMessage.text}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {["M-Pesa", "Card", "Bank Transfer"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`p-3 rounded-xl border-2 text-[10px] font-bold uppercase transition-all ${paymentMethod === m ? "border-[#2d1b0b] bg-[#2d1b0b]/5 text-[#2d1b0b]" : "border-gray-100 text-gray-400"}`}
                  >
                    {m === "M-Pesa" && (
                      <Smartphone className="mx-auto mb-1" size={18} />
                    )}
                    {m === "Card" && (
                      <CreditCard className="mx-auto mb-1" size={18} />
                    )}
                    {m === "Bank Transfer" && (
                      <Building2 className="mx-auto mb-1" size={18} />
                    )}
                    {m}
                  </button>
                ))}
              </div>

              {paymentMethod === "Bank Transfer" && (
                <div className="space-y-2 mt-4">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Bank Instructions
                  </label>
                  <textarea
                    className="w-full p-3 rounded-xl border border-gray-200 text-sm h-24 outline-none focus:border-[#2d1b0b] transition-colors"
                    placeholder="Enter Bank Name, Account Number, etc..."
                    value={bankInstructions}
                    onChange={(e) => setBankInstructions(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400">
                  Line Items
                </label>
                {quoteItems.map((item, i) => (
                  <div key={i} className="flex gap-2 bg-gray-50 p-2 rounded-xl">
                    <input
                      className="flex-1 bg-transparent p-2 text-sm outline-none font-medium text-[#2d1b0b]"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(e) => {
                        const next = [...quoteItems];
                        next[i].name = e.target.value;
                        setQuoteItems(next);
                      }}
                    />
                    <input
                      type="number"
                      className="w-24 bg-white border border-gray-200 rounded-lg p-2 text-sm text-right font-mono text-[#2d1b0b]"
                      placeholder="0.00"
                      value={item.price}
                      onChange={(e) => {
                        const next = [...quoteItems];
                        next[i].price = e.target.value;
                        setQuoteItems(next);
                      }}
                    />
                    <button
                      onClick={() =>
                        setQuoteItems(quoteItems.filter((_, idx) => idx !== i))
                      }
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setQuoteItems([...quoteItems, { name: "", price: "" }])
                  }
                  className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-bold text-gray-400 hover:text-[#2d1b0b] hover:border-[#2d1b0b]/20 transition-all"
                >
                  + ADD ITEM
                </button>
              </div>

              <div className="bg-[#2d1b0b] text-white p-5 rounded-2xl flex justify-between items-center shadow-lg">
                <div>
                  <span className="text-[10px] opacity-60 uppercase font-bold tracking-wider">
                    Total Amount
                  </span>
                  <p className="text-2xl font-bold font-serif">
                    {selectedBooking?.currency} {totalAmount.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="opacity-20" size={32} />
              </div>

              <button
                onClick={handleSendQuote}
                disabled={isSubmitting || totalAmount <= 0}
                className="w-full bg-[#2d1b0b] hover:bg-[#3d2b1b] text-white py-4 rounded-xl font-bold shadow-lg disabled:bg-gray-300 transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCcw className="animate-spin" size={18} /> Sending...
                  </span>
                ) : (
                  "Finalize & Send Quote"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
