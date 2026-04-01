"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-black flex flex-col overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/images/404.jpg"
          alt="404 Safari Path Not Found"
          className="w-full h-full object-cover md:object-contain bg-black"
        />
        {/* Optional: Dark overlay to make text more readable */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl md:text-7xl font-black text-white drop-shadow-2xl">
          Page Not Found
        </h1>

        <p className="text-lg md:text-2xl text-white font-medium mt-4 drop-shadow-md">
          Oops! The safari path you are looking for doesn’t exist.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 bg-[#4a5d23] text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-all shadow-xl"
        >
          Go Home <ArrowRight size={22} />
        </Link>
      </div>

      {/* Spacer to maintain layout height if you have a fixed footer elsewhere */}
      <div className="relative z-10 h-20"></div>
    </div>
  );
}
