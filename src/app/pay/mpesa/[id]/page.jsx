"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Smartphone,
  Zap,
  RefreshCcw,
  Lock,
  Loader2,
  AlertCircle,
  Leaf,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function MpesaPaymentPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState(null);
  // New state for descriptive loading
  const [statusMessage, setStatusMessage] = useState("Initiating payment...");

  useEffect(() => {
    if (!id) return;
    const loadBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/public?id=${id}`);
        const data = await res.json();
        const found = Array.isArray(data) ? data[0] : data.data || data;
        setBooking(found);
      } catch (err) {
        console.error("Failed to load booking:", err);
      } finally {
        setFetching(false);
      }
    };
    loadBooking();
  }, [id]);

  const handleMpesaPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setStatusMessage("Contacting Safaricom...");

    try {
      let cleanedPhone = phoneNumber.replace(/\D/g, "");
      if (cleanedPhone.startsWith("0"))
        cleanedPhone = "254" + cleanedPhone.slice(1);

      const res = await fetch("/api/daraja/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: Number(id),
          phone: cleanedPhone,
          amount: Number(booking.quoted_price),
        }),
      });

      const data = await res.json();

      if (data?.ResponseCode === "0" || data?.MerchantRequestID) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("STK Push Error:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#9a3412]" />
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
        {/* HEADER */}
        <div className="bg-[#191008] p-8 text-center text-white">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-stone-800">
            <Smartphone size={18} className="text-[#16a34a]" />
          </div>
          <h2 className="text-2xl font-serif">M-Pesa Secure Checkout</h2>
          <p className="text-stone-400 text-xs mt-1">
            Booking Ref: #LVS-{id}-A
          </p>
        </div>

        {/* LOADING OVERLAY */}
        {loading ? (
          <div className="p-12 text-center space-y-4">
            <Loader2
              className="animate-spin mx-auto text-[#9a3412]"
              size={48}
            />
            <p className="text-sm font-medium text-stone-600 animate-pulse">
              {statusMessage}
            </p>
          </div>
        ) : status ? (
          <div className="p-12 text-center space-y-4">
            {status === "success" ? (
              <>
                <CheckCircle2 className="mx-auto text-green-600" size={48} />
                <h3 className="text-lg font-bold text-stone-800">
                  Request Sent!
                </h3>
                <p className="text-sm text-stone-500">
                  Please check your phone and enter your M-Pesa PIN to complete
                  the transaction.
                </p>
              </>
            ) : (
              <>
                <XCircle className="mx-auto text-red-600" size={48} />
                <h3 className="text-lg font-bold text-stone-800">
                  Initiation Failed
                </h3>
                <button
                  onClick={() => setStatus(null)}
                  className="text-[#9a3412] font-bold text-sm underline"
                >
                  Try Again
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="p-7 border-b border-stone-100">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                TOTAL DUE
              </p>
              <span className="text-3xl font-bold text-[#1c1107] font-serif">
                {booking.currency || "KES"}{" "}
                {Number(booking.quoted_price || 0).toLocaleString()}
              </span>
            </div>

            <div className="p-7">
              <form onSubmit={handleMpesaPayment} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
                    M-PESA MOBILE NUMBER
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 712 345 678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pb-2.5 pt-1 bg-transparent border-b border-stone-300 focus:outline-none focus:border-[#a16207] text-stone-800 font-medium text-sm transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#9a3412] hover:bg-[#7c2d12] text-white py-3.5 rounded-xl font-bold text-sm uppercase flex justify-center items-center gap-2"
                >
                  <Zap size={14} /> Initiate STK Push
                </button>
              </form>
            </div>
          </>
        )}

        <div className="bg-[#fff1f2]/50 p-4 text-center border-t border-stone-100 flex items-center justify-center gap-1.5">
          <Lock size={12} className="text-[#9a3412]" />
          <p className="text-[10px] font-bold text-[#9a3412] uppercase tracking-wider">
            SECURE ENCRYPTED TRANSACTION
          </p>
        </div>
      </div>
    </div>
  );
}
