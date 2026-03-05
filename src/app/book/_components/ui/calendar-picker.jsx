"use client";

import { useState, useMemo } from "react";

export default function CalendarPicker({ startDate, endDate, onChange }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);

  /* ===================================================== */
  /* FORMAT DATE */
  /* ===================================================== */

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  /* ===================================================== */
  /* CALENDAR LOGIC */
  /* ===================================================== */

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

  /* ===================================================== */
  /* RANGE CHECK */
  /* ===================================================== */

  const isInRange = (date) => {
    if (!startDate || !endDate) return false;

    const formatted = formatDate(date);

    return formatted > startDate && formatted < endDate;
  };

  /* ===================================================== */
  /* SELECTION HANDLER */
  /* ===================================================== */

  const handleSelect = (date) => {
    const formatted = formatDate(date);

    if (!startDate || (startDate && endDate)) {
      onChange(formatted, null); // start new selection
    } else {
      onChange(startDate, formatted); // set end
    }
  };

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (
    <div className="bg-(--color-light) border border-(--color-dark-muted) rounded-xl p-6 mt-3 text-(--color-dark)">
      {/* ================= HEADER ================= */}

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
          className="font-bold hover:text-(--color-primary)"
        >
          ←
        </button>

        <h3 className="font-heading text-lg">
          {currentMonth.toLocaleString("default", {
            month: "long",
          })}{" "}
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
          className="font-bold hover:text-(--color-primary)"
        >
          →
        </button>
      </div>

      {/* ================= DAY LABELS ================= */}

      <div className="grid grid-cols-7 text-center text-sm mb-2 text-(--color-dark-muted)">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* ================= DATE GRID ================= */}

      <div className="grid grid-cols-7 gap-2">
        {dates.map((date, index) =>
          date ? (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(date)}
              className={`relative p-2 rounded-md transition text-(--color-dark)

                ${
                  startDate && formatDate(date) === startDate
                    ? "bg-(--color-primary) text-white z-10"
                    : ""
                }

                ${
                  endDate && formatDate(date) === endDate
                    ? "bg-(--color-secondary) text-white z-10"
                    : ""
                }

                ${isInRange(date) ? "bg-(--color-primary)/20" : ""}

                hover:bg-(--color-secondary) hover:text-white
              `}
            >
              {date.getDate()}
            </button>
          ) : (
            <div key={index} />
          ),
        )}
      </div>
    </div>
  );
}
