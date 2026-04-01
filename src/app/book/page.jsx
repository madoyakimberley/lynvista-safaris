"use client";

import { useState, useEffect } from "react";
import MainBookingForm from "./_components/forms/main-booking-form";
import Skeleton from "../_components/Skeleton/page";

export default function BookingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small timeout to allow the background CSS and form components to mount
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* 1. FULL PAGE SKELETON */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 bg-white">
          <Skeleton />
        </div>
      )}

      {/* 2. THE ACTUAL CONTENT */}
      <div
        className={`transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"} booking-bg min-h-screen flex items-center justify-center p-10`}
      >
        <div className="booking-card">
          <MainBookingForm />
        </div>
      </div>
    </div>
  );
}
