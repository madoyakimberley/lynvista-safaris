"use client";

import { useState, useEffect } from "react";
import MainBookingForm from "./_components/forms/main-booking-form";
import Skeleton from "./Skeleton";

export default function BookingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // This hits your Next.js API route
        const response = await fetch("/api/tours");
        const data = await response.json();
        setTours(data);
      } catch (error) {
        console.error("Failed to fetch tours:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div className="booking-bg min-h-screen flex items-center justify-center p-10">
      <div className="booking-card">
        {/* Pass the fetched tours down to your form */}
        <MainBookingForm tours={tours} />
      </div>
    </div>
  );
}
