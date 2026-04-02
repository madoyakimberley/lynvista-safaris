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
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    tour_package: "",
    flight_type: "None",
    departure_city: "",
    arrival_city: "",
    accommodation_type: "None",
    travel_start_date: today,
    travel_end_date: "",
    adults: 1,
    children: 0,
    currency: "USD",
    notes: "",
    payment_method: "Stripe",
    payment_status: "Pending",
    managed_status: "Pending",
    quoted_price: 0,
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

    const payload = {
      ...form,
      travel_start_date: toSQL(form.travel_start_date),
      travel_end_date: toSQL(form.travel_end_date),
      adults: Number(form.adults),
      children: Number(form.children),
      user_id: form.user_id || null,
    };

    const res = await createBooking(payload);

    if (res) {
      setSuccess(true);

      setTimeout(() => {
        document
          .getElementById("booking-success")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);

      setTimeout(() => {
        router.push("/book/confirmation");
      }, 3000);
    }
  };

  // Styles
  const inputStyle =
    "w-full border border-[var(--color-dark-muted)] rounded-xl p-3 bg-white text-[#442c23] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]";
  const labelStyle = "text-sm font-semibold text-[#442c23] mb-1";

  const radioItemStyle = "flex items-center gap-3 cursor-pointer group";
  const radioCircleStyle =
    "w-5 h-5 rounded-full border-2 border-[#442c23] flex items-center justify-center transition-all group-hover:border-[#8b5e3c]";
  const radioActiveStyle = "w-2.5 h-2.5 rounded-full bg-[#442c23]";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-(--color-light) rounded-3xl shadow-2xl p-6 md:p-12 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6"
    >
      <h1 className="col-span-1 md:col-span-2 text-3xl md:text-4xl font-heading text-[#442c23] text-center mb-2">
        Book Your Trip
      </h1>

      <div className="col-span-1 md:col-span-2 w-24 h-1 bg-(--color-secondary) mx-auto rounded-full mb-4" />

      {success && (
        <div
          id="booking-success"
          className="col-span-1 md:col-span-2 bg-green-100 text-[#442c23] p-4 rounded-xl text-center font-semibold"
        >
          Booking Successful! Redirecting...
        </div>
      )}

      {/* Passenger Info */}
      <div className="col-span-1 md:col-span-2 flex flex-col">
        <label className={labelStyle}>Name</label>
        <input
          name="full_name"
          required
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      <div className="col-span-1 md:col-span-1 flex flex-col">
        <label className={labelStyle}>Email</label>
        <input
          type="email"
          name="email"
          required
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      <div className="col-span-1 md:col-span-1 flex flex-col">
        <label className={labelStyle}>Phone</label>
        <input
          name="phone"
          required
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      {/* Tour Selection */}
      <div className="col-span-1 md:col-span-2 text-[#442c23]">
        <SelectMenu
          label="Select Tour Package"
          options={tours?.map((t) => t.title) || []}
          value={form.tour_package}
          onChange={(val) => setForm({ ...form, tour_package: val })}
        />
      </div>

      {/* Payment Method */}
      <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
        <label className={labelStyle}>Preferred Payment Method</label>
        <div className="flex flex-wrap gap-4 md:gap-8 p-4 border border-(--color-dark-muted) rounded-xl bg-white">
          {[
            { label: "Card Payment", value: "Stripe" },
            { label: "M-Pesa", value: "M-Pesa" },
          ].map((method) => (
            <label
              key={method.value}
              className={`${radioItemStyle} flex items-center cursor-pointer`}
            >
              <input
                type="radio"
                name="payment_method"
                value={method.value}
                checked={form.payment_method === method.value}
                onChange={handleChange}
                className="hidden"
              />
              <div className={radioCircleStyle}>
                {form.payment_method === method.value && (
                  <div className={radioActiveStyle} />
                )}
              </div>
              <span className="ml-2 font-medium text-[#2d1b0b]">
                {method.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Flight Type */}
      <div className="col-span-1 md:col-span-1 flex flex-col gap-2">
        <label className={labelStyle}>Flight Type</label>
        <div className="flex flex-wrap gap-3">
          {["None", "Domestic", "International"].map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer text-[#442c23]"
            >
              <input
                type="radio"
                name="flight_type"
                value={type}
                checked={form.flight_type === type}
                onChange={handleChange}
                className="hidden peer"
              />
              <div className="w-5 h-5 rounded-full border-2 border-(--color-dark-muted) peer-checked:border-(--color-primary) peer-checked:bg-(--color-primary) transition shrink-0" />
              <span className="text-xs font-medium">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Accommodation Type */}
      <div className="col-span-1 md:col-span-1 text-[#442c23]">
        <SelectMenu
          label="Accommodation"
          options={["None", "Hotel", "Resort", "Lodge", "Camp", "Apartment"]}
          value={form.accommodation_type}
          onChange={(val) => setForm({ ...form, accommodation_type: val })}
        />
      </div>

      {/* Travel Dates */}
      <div className="col-span-1 md:col-span-2 text-[#442c23]">
        <label className={labelStyle}>Trip Duration</label>
        <div className="w-full overflow-hidden">
          <CalendarPicker
            startDate={form.travel_start_date}
            endDate={form.travel_end_date}
            minDate={today}
            onChange={(s, e) =>
              setForm({ ...form, travel_start_date: s, travel_end_date: e })
            }
          />
        </div>
      </div>

      {/* Travelers */}
      <div className="col-span-1 md:col-span-1 flex flex-col">
        <label className={labelStyle}>Adults</label>
        <input
          type="number"
          name="adults"
          min="1"
          value={form.adults}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      <div className="col-span-1 md:col-span-1 flex flex-col">
        <label className={labelStyle}>Children</label>
        <input
          type="number"
          name="children"
          min="0"
          value={form.children}
          onChange={handleChange}
          className={inputStyle}
        />
      </div>

      {/* Currency */}
      <div className="col-span-1 md:col-span-2 text-[#442c23]">
        <SelectMenu
          label="Currency"
          options={["KES", "USD", "EUR"]}
          value={form.currency}
          onChange={(val) => setForm({ ...form, currency: val })}
        />
      </div>

      {/* Notes */}
      <div className="col-span-1 md:col-span-2 flex flex-col">
        <label className={labelStyle}>Special Requests</label>
        <textarea
          name="notes"
          onChange={handleChange}
          className={`${inputStyle} h-24`}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="col-span-1 md:col-span-2 bg-[#442c23] text-white font-heading py-4 rounded-xl hover:opacity-90 transition text-lg mt-4 shadow-lg"
      >
        {loading ? "Submitting..." : "Submit Booking"}
      </button>
    </form>
  );
}
