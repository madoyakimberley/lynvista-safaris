"use client";

import { useState } from "react";
import useBook from "@/app/hooks/useBook";
import { useRouter } from "next/navigation";

export default function ServiceBookingForm({ serviceId }) {
  const { createBooking, loading } = useBook();
  const router = useRouter();

  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createBooking({
      ...form,
      service_id: serviceId,
    });

    router.push("/booking/confirmation");
  };

  return (
    <form onSubmit={handleSubmit} className="booking-grid">
      <div className="full">
        <label>Full Name</label>
        <input name="full_name" onChange={handleChange} />
      </div>

      <div>
        <label>Email</label>
        <input name="email" onChange={handleChange} />
      </div>

      <div>
        <label>Phone</label>
        <input name="phone" onChange={handleChange} />
      </div>

      <div className="full text-center">
        <button className="submit-btn">
          {loading ? "Submitting..." : "Book Service"}
        </button>
      </div>
    </form>
  );
}
