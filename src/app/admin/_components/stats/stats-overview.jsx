"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Plus,
  TrendingUp,
  Clock,
  PlaneTakeoff,
  Wallet,
  User,
  Printer,
  TrendingDown,
  FileText,
  Save,
} from "lucide-react";
import StatsSkeleton from "./stats-skeleton";

// Static conversion rates relative to a USD base table structure
const CURRENCY_CONFIG = {
  USD: { symbol: "$", rate: 1 },
  KSH: { symbol: "Ksh ", rate: 130 },
  EUR: { symbol: "€", rate: 0.92 },
};

export default function StatsOverview() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Currency state tracking for the metric card conversion
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

  // State for temporary, in-session scratchpad notes
  const [sessionNotes, setSessionNotes] = useState("");
  const [notesList, setNotesList] = useState([]);

  async function loadBookings() {
    try {
      const res = await fetch("/api/admin/bookings", { cache: "no-store" });
      const result = await res.json();
      const actualData = Array.isArray(result) ? result : result.data;

      if (Array.isArray(actualData)) {
        setBookings(actualData);
      }
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
    const interval = setInterval(loadBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!sessionNotes.trim()) return;
    setNotesList((prev) => [
      {
        id: Date.now(),
        text: sessionNotes,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...prev,
    ]);
    setSessionNotes("");
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <StatsSkeleton />;

  // 1. Core Counts
  const totalBookings = bookings.length;
  const paidBookings = bookings.filter(
    (b) => b.payment_status === "Paid",
  ).length;
  const pendingBookings = bookings.filter(
    (b) => b.payment_status === "Pending",
  ).length;

  // 2. Average Booking Value Calculation
  const totalQuoted = bookings.reduce(
    (acc, curr) => acc + (Number(curr.quoted_price) || 0),
    0,
  );
  const averageBookingValueUSD =
    totalBookings > 0 ? totalQuoted / totalBookings : 0;

  // Perform conversions dynamically based on selector
  const activeCurrencyConfig = CURRENCY_CONFIG[selectedCurrency];
  const convertedAverageValue = Math.round(
    averageBookingValueUSD * activeCurrencyConfig.rate,
  );

  // 3. Dynamic Aggregation: Most and Least Popular Tours
  const tourMetrics = bookings.reduce((acc, b) => {
    const pkg = b.tour_package || "Custom Itinerary Layout";
    acc[pkg] = (acc[pkg] || 0) + 1;
    return acc;
  }, {});

  let mostPopularTour = "N/A";
  let leastPopularTour = "N/A";
  let maxCount = 0;
  let minCount = Infinity;

  Object.entries(tourMetrics).forEach(([pkg, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostPopularTour = pkg;
    }
    if (count < minCount) {
      minCount = count;
      leastPopularTour = pkg;
    }
  });

  if (totalBookings === 0) {
    mostPopularTour = "No data available";
    leastPopularTour = "No data available";
  }

  return (
    <div className="w-full text-[#3A2E26] font-sans print:p-0">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#5c4021] mb-1">
            Safari Operations Center
          </h1>
          <p className="text-[#8b7355] font-serif italic text-lg">
            Managing the wild with tailored precision.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="bg-white border border-[#e8e4d9] px-5 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[#5c4021] shadow-sm">
            <Calendar size={16} /> MAY 29, 2026
          </div>
          <button
            onClick={handlePrint}
            className="bg-white border border-[#5c4021] text-[#5c4021] px-5 py-2.5 rounded-lg flex items-center gap-2 text-xs font-bold tracking-widest uppercase shadow-sm hover:bg-[#FAF9F4] transition-colors"
          >
            <Printer size={16} /> Print Report
          </button>
        </div>
      </div>

      {/* PRINT-ONLY MANIFEST HEADER */}
      <div className="hidden print:block border-b-2 border-[#5c4021] pb-6 mb-8">
        <h1 className="text-4xl font-serif font-bold text-[#5c4021]">
          Lynvista Safaris Manifest
        </h1>
        <p className="text-sm uppercase tracking-widest text-[#8b7355] font-bold mt-1">
          Internal Operational Audit Summary — Generated{" "}
          {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* 2. STATS CARDS (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 page-break-inside-avoid">
        {/* Total Bookings */}
        <div className="bg-[#fdfbf7] border border-[#f0ebe1] p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8b7355] mb-4">
              Total Active Bookings
            </p>
            <h3 className="text-4xl font-serif font-bold text-[#5c4021] mb-6">
              {totalBookings}
            </h3>
            <p className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <TrendingUp size={14} /> Live metrics stream
            </p>
          </div>
          <Calendar
            size={120}
            className="absolute -bottom-8 -right-8 text-[#5c4021] opacity-[0.03]"
          />
        </div>

        {/* Pending Bookings */}
        <div className="bg-[#fdfbf7] border border-[#f0ebe1] p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8b7355] mb-4">
              Pending Quotations
            </p>
            <h3 className="text-4xl font-serif font-bold text-[#5c4021] mb-6">
              {pendingBookings}
            </h3>
            <p className="text-xs font-bold text-rose-700 flex items-center gap-1">
              <Clock size={14} />{" "}
              {pendingBookings > 0
                ? `${pendingBookings} awaiting responses`
                : "No open pipelines"}
            </p>
          </div>
          <Clock
            size={120}
            className="absolute -bottom-8 -right-8 text-[#5c4021] opacity-[0.03]"
          />
        </div>

        {/* Confirmed Bookings */}
        <div className="bg-[#fdfbf7] border border-[#f0ebe1] p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8b7355] mb-4">
              Confirmed Safaris
            </p>
            <h3 className="text-4xl font-serif font-bold text-[#5c4021] mb-6">
              {paidBookings}
            </h3>
            <p className="text-xs font-bold text-[#8b7355] flex items-center gap-1">
              <PlaneTakeoff size={14} /> Validated checkouts
            </p>
          </div>
          <PlaneTakeoff
            size={120}
            className="absolute -bottom-8 -right-8 text-[#5c4021] opacity-[0.03]"
          />
        </div>

        {/* Average Booking Value with Currency Switcher */}
        <div className="bg-[#fdfbf7] border border-[#f0ebe1] p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4 gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8b7355]">
                  Average Booking Value
                </p>
                {/* Clean inline currency controls */}
                <div className="flex gap-1 text-[9px] font-mono font-bold bg-[#FAF9F4] border border-[#e8e4d9] rounded p-0.5 print:hidden">
                  {Object.keys(CURRENCY_CONFIG).map((cur) => (
                    <button
                      key={cur}
                      type="button"
                      onClick={() => setSelectedCurrency(cur)}
                      className={`px-1.5 py-0.5 rounded transition-colors ${
                        selectedCurrency === cur
                          ? "bg-[#5c4021] text-white"
                          : "text-[#8b7355] hover:text-[#5c4021]"
                      }`}
                    >
                      {cur}
                    </button>
                  ))}
                </div>
              </div>
              <h3 className="text-3xl font-serif font-bold text-[#5c4021] mb-6 tracking-tight">
                {activeCurrencyConfig.symbol}
                {convertedAverageValue.toLocaleString()}
              </h3>
            </div>
            <p className="text-xs font-bold text-[#8b7355] flex items-center gap-1 mt-auto">
              <Wallet size={14} /> Global pricing index ({selectedCurrency})
            </p>
          </div>
          <Wallet
            size={120}
            className="absolute -bottom-8 -right-8 text-[#5c4021] opacity-[0.03]"
          />
        </div>
      </div>

      {/* 3. MAIN DASHBOARD SPLIT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Recent Activity */}
        <div className="xl:col-span-8 bg-white border border-[#e8e4d9] rounded-2xl p-8 shadow-sm print:border-0 print:shadow-none">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-[#1f1610]">
              Recent Activity
            </h2>
            <button className="text-sm font-bold text-[#5c4021] hover:text-[#4a3219] transition-colors print:hidden">
              View All
            </button>
          </div>

          <div className="space-y-6">
            {bookings.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                No recent bookings found.
              </p>
            ) : (
              bookings.slice(0, 5).map((booking, index) => (
                <div
                  key={booking.id || index}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-100 last:border-0 gap-4 page-break-inside-avoid"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-lg bg-[#FAF9F4] border border-[#e8e4d9] flex items-center justify-center shrink-0 print:hidden">
                      <User size={24} className="text-[#a48665]" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#1f1610]">
                        {booking.full_name}
                      </h4>
                      <p className="text-sm text-[#8b7355]">
                        {booking.tour_package || "Custom Safari Plan"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <span className="text-[10px] font-bold text-[#a48665] uppercase tracking-widest">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        booking.payment_status === "Paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : booking.payment_status === "Pending"
                            ? "bg-[#fcf3e3] text-[#b38529]"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {booking.payment_status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="xl:col-span-4 space-y-8">
          {/* Package Trackers Widget (Most & Least Popular) */}
          <div className="bg-[#1a1410] rounded-2xl p-8 text-white relative overflow-hidden shadow-lg page-break-inside-avoid">
            <h3 className="text-2xl font-serif font-bold mb-6 relative z-10">
              Package Performance
            </h3>

            <div className="space-y-6 relative z-10">
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#e9bc47] mb-2">
                  <TrendingUp size={14} /> Most Requested Voyage
                </div>
                <p className="text-lg font-serif font-bold tracking-wide text-white leading-tight">
                  {mostPopularTour}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-2">
                  <TrendingDown size={14} /> Lowest Volume Package
                </div>
                <p className="text-base font-serif font-bold tracking-wide text-white/80 leading-tight">
                  {leastPopularTour}
                </p>
              </div>
            </div>
          </div>

          {/* In-Session Notes Scratchpad */}
          <div className="bg-[#fcf7f2] border border-[#f0ebe1] rounded-2xl p-8 shadow-sm page-break-inside-avoid print:bg-white">
            <div className="flex items-center gap-2 text-[#5c4021] mb-2">
              <FileText size={20} />
              <h3 className="text-2xl font-serif font-bold">
                In-Session Notes
              </h3>
            </div>

            <p className="text-xs text-[#8b7355] leading-relaxed mb-4">
              This scratchpad holds temporary operational notes for your current
              dashboard window session. These inputs remain localized in memory
              and are not pushed onto the remote persistent database servers.
            </p>

            {/* Note Input Form */}
            <form
              onSubmit={handleAddNote}
              className="relative mb-6 print:hidden"
            >
              <input
                type="text"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Jot down active updates..."
                className="w-full bg-transparent border-b-2 border-[#e8e4d9] py-3 text-sm focus:outline-none focus:border-[#5c4021] transition-colors pr-10 text-[#1f1610] placeholder:text-[#a48665]"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#5c4021] hover:text-[#3A2E26] transition-colors"
              >
                <Save size={18} />
              </button>
            </form>

            {/* Notes List Display */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {notesList.length === 0 ? (
                <div className="bg-white/60 p-4 rounded-xl border border-dashed border-[#e8e4d9] text-center">
                  <p className="text-xs italic text-[#a48665]">
                    Scratchpad is empty.
                  </p>
                </div>
              ) : (
                notesList.map((note) => (
                  <div
                    key={note.id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-[#e8e4d9]"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#a48665]">
                        Active Memo
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono">
                        {note.time}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#4a3219] leading-relaxed">
                      {note.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
