"use client";
import { useState } from "react";

export default function SelectMenu({ options, value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <label className="text-sm font-semibold text-(--color-dark-muted) mb-1 block">
        {label}
      </label>

      {/* Display Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-(--color-dark-muted) rounded-xl p-3 bg-white text-(--color-dark) cursor-pointer flex justify-between items-center transition-colors"
      >
        <span className={value ? "text-(--color-dark)" : "text-gray-400"}>
          {value || "Select an option"}
        </span>

        {/* Animated SVG Arrow */}
        <div className="w-5 h-5 flex items-center justify-center transition-transform duration-300">
          <svg
            className={`w-3 h-3 text-(--color-dark) transform transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-(--color-dark-muted) rounded-xl shadow-xl overflow-hidden">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="p-3 text-(--color-dark) hover:bg-(--color-secondary) hover:text-white cursor-pointer transition"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
