"use client";

import { useParams } from "next/navigation";
import ServiceBookingForm from "../_components/forms/service-booking-form";

export default function ServiceBookingPage() {
  const params = useParams();
  const { serviceId } = params;

  return (
    <main className="booking-bg min-h-screen flex items-center justify-center p-6">
      <div className="booking-card">
        <h1 className="booking-title text-center mb-6">Service Booking</h1>

        <ServiceBookingForm serviceId={serviceId} />
      </div>
    </main>
  );
}
