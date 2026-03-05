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
      setSuccess(false);

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createBooking,
    loading,
    error,
    success,
  };
}
