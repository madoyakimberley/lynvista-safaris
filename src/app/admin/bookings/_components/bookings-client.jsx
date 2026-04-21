"use client";

import { useState, useEffect } from "react";
import {
  Search,
  RefreshCcw,
  Plus,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  DollarSign,
  Smartphone,
  CreditCard,
  Building2,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [quoteItems, setQuoteItems] = useState([
    { name: "Base Package", price: "" },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("M-Pesa");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // --- FIX: Define totalAmount here so it's accessible everywhere ---
  const totalAmount = quoteItems.reduce(
    (sum, i) => sum + (Number(i.price) || 0),
    0,
  );

  async function refresh() {
    try {
      const res = await fetch("/api/admin/bookings", { cache: "no-store" });
      const result = await res.json();
      setBookings(Array.isArray(result?.data) ? result.data : []);
    } catch (err) {
      setBookings([]);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const openQuoteModal = (booking) => {
    setSelectedBooking(booking);
    setQuoteItems([
      { name: "Base Package", price: booking.quoted_price || "" },
    ]);
    setIsModalOpen(true);
    setStatusMessage(null);
  };

  const handleSendQuote = async () => {
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "quote",
          id: selectedBooking.id,
          quoted_price: totalAmount, // Now using the top-level variable
          items: quoteItems,
          email: selectedBooking.email,
          full_name: selectedBooking.full_name,
          currency: selectedBooking.currency || "USD",
          payment_method: paymentMethod,
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

  const filtered = (Array.isArray(bookings) ? bookings : [])
    .filter((b) =>
      (b.full_name || "").toLowerCase().includes(search.toLowerCase()),
    )
    .filter((b) => (filter === "All" ? true : b.payment_status === filter));

  return (
    <div className="min-h-screen p-6 text-[#2d1b0b] bg-[#faf8f3]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#2d1b0b]">Manage Bookings</h1>
        <button onClick={refresh} className="p-2 hover:bg-black/5 rounded-full">
          <RefreshCcw size={20} />
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 flex items-center border border-[#2d1b0b]/10 bg-white rounded-xl px-4">
          <Search size={18} className="opacity-40" />
          <input
            className="p-3 w-full outline-none bg-transparent"
            placeholder="Search client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="border border-[#2d1b0b]/10 p-3 rounded-xl bg-white outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Quotation Sent">Quoted</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <BookingsTable bookings={filtered} sendPaymentLink={openQuoteModal} />

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
                className="p-2 hover:bg-gray-100 rounded-full"
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

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400">
                  Line Items
                </label>
                {quoteItems.map((item, i) => (
                  <div key={i} className="flex gap-2 bg-gray-50 p-2 rounded-xl">
                    <input
                      className="flex-1 bg-transparent p-2 text-sm outline-none font-medium"
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
                      className="w-24 bg-white border border-gray-200 rounded-lg p-2 text-sm text-right font-mono"
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
                      className="p-2 text-gray-300 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setQuoteItems([...quoteItems, { name: "", price: "" }])
                  }
                  className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-bold text-gray-400 hover:text-[#2d1b0b] hover:border-[#2d1b0b]/20"
                >
                  + ADD ITEM
                </button>
              </div>

              <div className="bg-[#2d1b0b] text-white p-5 rounded-2xl flex justify-between items-center shadow-lg">
                <div>
                  <span className="text-[10px] opacity-60 uppercase font-bold tracking-wider">
                    Total Amount
                  </span>
                  <p className="text-2xl font-bold">
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
