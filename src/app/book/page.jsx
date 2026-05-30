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
    // Updated container to match the light background aesthetic
    <div className="min-h-screen bg-[#fdfbf7] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Pass the fetched tours down to your form */}
        <MainBookingForm tours={tours} />
      </div>
    </div>
  );
}
