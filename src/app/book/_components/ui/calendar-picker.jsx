"use client";

import { useState } from "react";

const C = {
  dark: "#442c23",
  gold: "#c9a87c",
  sand: "#e8d5c0",
  parchment: "#fdf6ee",
  cream: "#f5efe6",
  muted: "#8b6247",
  range: "#e8d5c0",
};

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CalendarPicker({
  startDate,
  endDate,
  onChange,
  minDate,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minAllowed = minDate ? new Date(minDate + "T00:00:00") : today;

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const fmt = (d) => d.toISOString().split("T")[0];

  const isStart = (d) => d && fmt(d) === startDate;
  const isEnd = (d) => d && fmt(d) === endDate;
  const isInRange = (d) => {
    if (!startDate || !endDate || !d) return false;
    const s = fmt(d);
    return s > startDate && s < endDate;
  };

  const handleSelect = (date) => {
    if (date < minAllowed) return;
    const f = fmt(date);
    if (!startDate || (startDate && endDate)) {
      onChange(f, null);
    } else {
      onChange(f < startDate ? f : startDate, f < startDate ? startDate : f);
    }
  };

  const secondMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    1,
  );

  const canGoPrev =
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1) >=
    new Date(today.getFullYear(), today.getMonth(), 1);

  const fmtDisplay = (ds) => {
    if (!ds) return null;
    const d = new Date(ds + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const nights =
    startDate && endDate
      ? Math.round((new Date(endDate) - new Date(startDate)) / 86400000)
      : 0;

  function renderMonth(dateObj) {
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDay = new Date(y, m, 1).getDay();
    const monthLabel = dateObj.toLocaleString("default", { month: "long" });

    const cells = [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => new Date(y, m, i + 1)),
    ];

    return (
      <div style={{ flex: 1 }}>
        {/* Month + year header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
          }}
        >
          <span
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "14px",
              fontWeight: "700",
              color: C.dark,
              letterSpacing: "0.04em",
            }}
          >
            {monthLabel} <span style={{ color: C.muted }}>{y}</span>
          </span>
        </div>

        {/* Day names */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px",
            marginBottom: "6px",
          }}
        >
          {DAY_NAMES.map((d) => (
            <div
              key={d}
              style={{
                textAlign: "center",
                fontSize: "10px",
                fontWeight: "700",
                color: C.muted,
                padding: "4px 0",
                fontFamily: "'Georgia', serif",
                letterSpacing: "0.06em",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "1px",
          }}
        >
          {cells.map((date, idx) => {
            if (!date)
              return <div key={`e-${idx}`} style={{ height: "34px" }} />;

            const past = date < minAllowed;
            const start = isStart(date);
            const end = isEnd(date);
            const inRange = isInRange(date);
            const sel = start || end;

            // Range background: full row for in-between, half-rounded for ends
            let cellBg = "transparent";
            let cellRadius = "50%";
            let textColor = past ? "#d4c5b8" : C.dark;
            let fontWeight = "400";

            if (!past) {
              if (sel) {
                cellBg = C.dark;
                textColor = C.cream;
                fontWeight = "700";
                if (start && endDate && startDate !== endDate)
                  cellRadius = "50% 0 0 50%";
                if (end && startDate && startDate !== endDate)
                  cellRadius = "0 50% 50% 0";
              } else if (inRange) {
                cellBg = C.range;
                textColor = C.dark;
                cellRadius = "0";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={past}
                onClick={() => handleSelect(date)}
                style={{
                  height: "34px",
                  fontSize: "13px",
                  background: cellBg,
                  color: textColor,
                  fontWeight,
                  borderRadius: cellRadius,
                  border: "none",
                  cursor: past ? "not-allowed" : "pointer",
                  textAlign: "center",
                  fontFamily: "'Georgia', serif",
                  transition: "background 0.12s",
                  position: "relative",
                  outline: "none",
                  // FIX APPLIED HERE: Changed textDecoration to textDecorationLine
                  textDecorationLine:
                    fmt(date) === fmt(today) && !sel ? "underline" : "none",
                  textDecorationColor: C.gold,
                  textUnderlineOffset: "3px",
                }}
                onMouseEnter={(e) => {
                  if (!past && !sel && !inRange)
                    e.currentTarget.style.background = "#f0e0cc";
                }}
                onMouseLeave={(e) => {
                  if (!past && !sel && !inRange)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: C.parchment,
        borderRadius: "16px",
        border: `1.5px solid ${C.sand}`,
        padding: "20px 20px 16px",
        position: "relative",
      }}
    >
      {/* Nav row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        {/* Prev */}
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
          disabled={!canGoPrev}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            background: canGoPrev ? C.dark : C.sand,
            color: C.cream,
            border: "none",
            cursor: canGoPrev ? "pointer" : "not-allowed",
            fontSize: "16px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
          }}
        >
          ‹
        </button>

        {/* Date range display */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <DatePill
            label={fmtDisplay(startDate) || "Start date"}
            active={!!startDate}
          />
          <span style={{ color: C.gold, fontSize: "12px" }}>→</span>
          <DatePill
            label={fmtDisplay(endDate) || "End date"}
            active={!!endDate}
          />
          {nights > 0 && (
            <span
              style={{
                background: C.sand,
                color: C.dark,
                borderRadius: "20px",
                padding: "3px 10px",
                fontSize: "11px",
                fontFamily: "'Georgia', serif",
                fontWeight: "600",
                marginLeft: "4px",
              }}
            >
              {nights}n
            </span>
          )}
        </div>

        {/* Next */}
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
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            background: C.dark,
            color: C.cream,
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
          }}
        >
          ›
        </button>
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: `1px dashed ${C.gold}`,
          marginBottom: "16px",
          opacity: 0.5,
        }}
      />

      {/* Two months side by side */}
      <div style={{ display: "flex", gap: "24px" }} className="cal-months">
        {renderMonth(currentMonth)}
        <div style={{ width: "1px", background: C.sand, flexShrink: 0 }} />
        {renderMonth(secondMonth)}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .cal-months { flex-direction: column !important; }
          .cal-months > div:nth-child(2) { display: none; }
        }
      `}</style>
    </div>
  );
}

function DatePill({ label, active }) {
  return (
    <span
      style={{
        background: active ? "#442c23" : "#e8d5c0",
        color: active ? "#f5efe6" : "#8b6247",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontFamily: "'Georgia', serif",
        fontWeight: active ? "600" : "400",
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
  );
}
