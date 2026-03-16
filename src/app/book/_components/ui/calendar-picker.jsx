"use client";

import { useState } from "react";

export default function CalendarPicker({ startDate, endDate, onChange }) {
  // Normalize today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const formatDate = (date) => date.toISOString().split("T")[0];

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const dates = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1),
    ),
  ];

  const isInRange = (date) => {
    if (!startDate || !endDate) return false;
    const formatted = formatDate(date);
    return formatted > startDate && formatted < endDate;
  };

  const handleSelect = (date) => {
    if (date < today) return; // Prevent selection of past dates
    const formatted = formatDate(date);
    if (!startDate || (startDate && endDate)) {
      onChange(formatted, null);
    } else {
      onChange(startDate, formatted);
    }
  };

  return (
    <div className="bg-[#fdfcf9] border border-[#e7e3da] rounded-xl p-6 mt-3 text-[#442c23]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1,
              ),
            )
          }
          className="font-bold hover:text-[#8b5e3c]"
        >
          ←
        </button>
        <h3 className="font-heading text-lg font-bold">
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h3>
        <button
          type="button"
          onClick={() =>
            setCurrentMonth(
              new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1,
              ),
            )
          }
          className="font-bold hover:text-[#8b5e3c]"
        >
          →
        </button>
      </div>

      {/* DAY LABELS */}
      <div className="grid grid-cols-7 text-center text-sm mb-2 text-[#8b5e3c]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* DATE GRID */}
      <div className="grid grid-cols-7 gap-1">
        {dates.map((date, index) => {
          const isPast = date && date < today;
          const isToday = date && formatDate(date) === formatDate(today);
          const isSelected =
            date &&
            (formatDate(date) === startDate || formatDate(date) === endDate);

          return date ? (
            <button
              key={index}
              type="button"
              disabled={isPast}
              onClick={() => handleSelect(date)}
              className={`relative p-2 rounded-md transition text-sm
                ${isPast ? "text-gray-300 cursor-not-allowed" : "text-[#442c23] hover:bg-[#442c23] hover:text-white"}
                ${isSelected ? "bg-[#442c23] text-white font-bold" : ""}
                ${isInRange(date) ? "bg-[#442c23]/20" : ""}
                ${isToday && !isSelected ? "border border-[#442c23] font-bold" : ""}
              `}
            >
              {date.getDate()}
            </button>
          ) : (
            <div key={index} />
          );
        })}
      </div>
      <p className="text-[10px] text-center mt-4 text-[#8b5e3c] italic">
        Select start and end dates for your safari
      </p>
    </div>
  );
}
