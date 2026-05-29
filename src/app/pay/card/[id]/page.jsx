"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function CardPaymentPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [billingEmail, setBillingEmail] = useState("");
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckout = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/intasend/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: booking.quoted_price,
          currency: booking.currency || "KES",
          email: billingEmail,
          api_ref: `Booking-${id}`,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(
          data.message || data.error || "Payment initialization failed.",
        );
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setErrorMessage(
        err.message || "System error. Please check your network.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    const loadBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/public?id=${id}`);
        const data = await res.json();
        const found = Array.isArray(data) ? data[0] : data.data || data;
        if (found) {
          setBooking(found);
          setBillingEmail(found.customer_email || found.email || "");
        }
      } catch (err) {
        console.error("Failed to load booking:", err);
      } finally {
        setFetching(false);
      }
    };
    loadBooking();
  }, [id]);

  if (fetching)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#854d0e]" />
      </div>
    );
  if (!booking)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <AlertCircle /> Booking not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#faf8f3] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
        <div className="bg-[#150e07] p-8 text-center text-white">
          <div className="w-14 h-14 bg-[#854d0e]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#854d0e]/30">
            <CreditCard size={22} className="text-amber-500" />
          </div>
          <h2 className="text-2xl font-serif">Secure Card Checkout</h2>
          <p className="text-stone-400 text-xs mt-1 uppercase tracking-widest">
            Booking Ref: #LVS-{id}-A
          </p>
        </div>

        <div className="p-7 border-b border-stone-100">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
            TOTAL DUE
          </p>
          <span className="text-3xl font-bold text-[#1c1107] font-serif">
            {booking.currency || "KES"}{" "}
            {Number(booking.quoted_price || 0).toLocaleString()}
          </span>
        </div>

        <div className="p-7 space-y-6">
          {/* Error Message Display */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-[10px] font-bold rounded-lg text-center uppercase tracking-widest">
              {errorMessage}
            </div>
          )}

          <input
            type="email"
            placeholder="guest@example.com"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            className="w-full pb-2.5 pt-1 bg-transparent border-b border-stone-300 focus:outline-none focus:border-[#854d0e] text-stone-800 font-medium text-sm transition-all"
          />

          <button
            type="button"
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#854d0e] hover:bg-[#713f12] text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider flex justify-center items-center gap-2 transition-all"
          >
            {loading ? "Redirecting..." : "Authorize Payment ➔"}
          </button>
        </div>

        <div className="bg-stone-50 p-4 border-t border-stone-100 flex justify-between px-6 text-[9px] font-bold text-stone-400 uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <Lock size={11} /> 256-BIT ENCRYPTION
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck size={11} /> PCI-DSS COMPLIANT
          </div>
        </div>
      </div>
    </div>
  );
}
