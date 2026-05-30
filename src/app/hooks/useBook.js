"use client";

import { useState } from "react";

export default function useBook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createBooking = async (bookingData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false); // reset on every request

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Booking failed");
      }

      setSuccess(true);
      return data; // ✅ always return success data
    } catch (err) {
      const message = err?.message || "Something went wrong";
      setError(message);
      return { error: message }; // ✅ consistent return
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error, success };
}
