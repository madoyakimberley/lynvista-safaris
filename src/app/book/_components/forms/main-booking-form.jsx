"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useBook from "@/app/hooks/useBook";
import useTours from "@/app/hooks/useTours";
import CalendarPicker from "../ui/calendar-picker";
import SelectMenu from "../ui/select-menu";

export default function MainBookingForm() {
  const router = useRouter();
  const { createBooking, loading } = useBook();
  const { tours, loading: toursLoading } = useTours();

  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    tour_package: "",
    flight_type: "Domestic Flight",
    departure_city: "",
    arrival_city: "",
    accommodation_type: "Hotel",
    travel_start_date: "",
    travel_end_date: "",
    travelers: 1,
    currency: "KES",
    notes: "",
    payment_status: "Pending",
    user_id: null,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toSQL = (date) => (date ? date.split("T")[0] : null);

    const cleanPayload = {
      ...form,
      travel_start_date: toSQL(form.travel_start_date),
      travel_end_date: toSQL(form.travel_end_date),
      travelers: Number(form.travelers),
      user_id: form.user_id || null,
    };

    const res = await createBooking(cleanPayload);

    if (res) {
      setSuccess(true);

      setTimeout(() => {
        document
          .getElementById("booking-success")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);

      // ✅ Auto redirect after 3 seconds
      setTimeout(() => {
        router.push("/book/confirmation");
      }, 3000);
    }
  };

  const inputStyle =
    "w-full border border-[var(--color-dark-muted)] rounded-xl p-3 bg-white text-[var(--color-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";

  const labelStyle =
    "text-sm font-semibold text-[var(--color-dark-muted)] mb-1";

  const radioWrapper =
    "flex items-center gap-2 cursor-pointer text-[var(--color-dark)]";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-(--color-light) rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <h1 className="col-span-2 text-4xl font-heading text-(--color-dark) text-center mb-2">
        Book Your Trip
      </h1>

      <div className="col-span-2 w-24 h-1 bg-(--color-secondary) mx-auto rounded-full" />

      {/* ================= SUCCESS MESSAGE ================= */}

      {success && (
        <div
          id="booking-success"
          className="col-span-2 bg-green-100 text-green-800 p-4 rounded-xl text-center font-semibold"
        >
          Booking Successful! Redirecting to confirmation page...
        </div>
      )}

      {/* ================= FORM FIELDS ================= */}

      <div className="col-span-2 flex flex-col">
        <label className={labelStyle}>Passenger Name</label>
        <input
          name="full_name"
          required
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelStyle}>Email</label>
        <input
          type="email"
          name="email"
          required
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelStyle}>Phone</label>
        <input
          name="phone"
          required
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      <div className="col-span-2">
        <SelectMenu
          label="Select Tour Package"
          options={tours?.map((t) => t.name) || []}
          value={form.tour_package}
          onChange={(val) => setForm({ ...form, tour_package: val })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelStyle}>Flight Type</label>
        <div className="flex gap-6">
          {["Domestic Flight", "International Flight"].map((type) => (
            <label key={type} className={radioWrapper}>
              <input
                type="radio"
                name="flight_type"
                value={type}
                checked={form.flight_type === type}
                onChange={handleChange}
                className="hidden peer"
              />
              <div className="w-5 h-5 rounded-full border-2 border-(--color-dark-muted) peer-checked:border-(--color-primary) peer-checked:bg-(--color-primary) transition" />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <SelectMenu
        label="Accommodation Type"
        options={["Hotel", "Resort", "Lodge", "Camp", "Apartment"]}
        value={form.accommodation_type}
        onChange={(val) => setForm({ ...form, accommodation_type: val })}
      />

      <div className="flex flex-col">
        <label className={labelStyle}>Departure City</label>
        <input
          name="departure_city"
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelStyle}>Arrival City</label>
        <input
          name="arrival_city"
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      <div className="col-span-2">
        <label className={labelStyle}>Trip Duration</label>

        <CalendarPicker
          startDate={form.travel_start_date}
          endDate={form.travel_end_date}
          onChange={(s, e) =>
            setForm({
              ...form,
              travel_start_date: s,
              travel_end_date: e,
            })
          }
        />
      </div>

      <div className="flex flex-col">
        <label className={labelStyle}>Number of Travelers</label>
        <input
          type="number"
          name="travelers"
          value={form.travelers}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      <SelectMenu
        label="Currency"
        options={["KES", "USD", "EUR"]}
        value={form.currency}
        onChange={(val) => setForm({ ...form, currency: val })}
      />

      <div className="col-span-2 flex flex-col">
        <label className={labelStyle}>Special Requests</label>
        <textarea
          name="notes"
          onChange={handleChange}
          className={`${inputStyle} h-24`}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="col-span-2 bg-(--color-dark) text-(--color-secondary) font-heading py-4 rounded-xl hover:bg-(--color-dark-muted) transition text-lg"
      >
        {loading ? "Submitting..." : "Submit Booking"}
      </button>
    </form>
  );
}
