"use client";

import { useEffect, useState } from "react";

export default function Loading() {
  const [show, setShow] = useState(false);

  // Prevent flash (only show if loading takes time)
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#2d1b0b] overflow-hidden">
      {/* Glow Background */}
      <div className="absolute w-75 h-75 bg-[#4a7c2c] opacity-20 blur-3xl rounded-full animate-pulse" />

      {/* Sun Loader */}
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="w-28 h-28 rounded-full border-2 border-[#fbbf24]/40 animate-spin" />

        {/* Inner rotating reverse */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-[#4a7c2c]/40 animate-[spin_6s_linear_reverse_infinite]" />

        {/* Center glowing core */}
        <div className="absolute w-10 h-10 bg-[#fbbf24] rounded-full shadow-[0_0_25px_#fbbf24] animate-pulse" />
      </div>

      {/* Subtle ground line (safari horizon vibe) */}
      <div className="absolute bottom-20 w-40 h-0.5 bg-linear-to-r from-transparent via-[#fbbf24]/40 to-transparent blur-sm" />
    </div>
  );
}
