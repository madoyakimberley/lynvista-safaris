"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    if (!reference) return;
    fetch(`/api/verify-payment?reference=${reference}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(
          data.success
            ? "Payment verified successfully!"
            : "Verification failed.",
        );
      })
      .catch(() => setStatus("Error connecting to server."));
  }, [reference]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf8f3] text-[#2d1b0b] p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-[#2d5016]/20">
        <h1 className="text-2xl font-bold text-[#2d5016] mb-4">
          Payment Status
        </h1>
        <p className="text-lg">{status}</p>
        <a
          href="/admin/bookings"
          className="mt-6 block bg-[#fbbf24] text-[#2d1b0b] font-bold py-2 rounded"
        >
          Return to Bookings
        </a>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
