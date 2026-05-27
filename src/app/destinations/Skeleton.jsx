import React from "react";

export default function Skeleton() {
  return (
    <div className="min-h-screen bg-(--color-light) animate-pulse relative w-full overflow-hidden">
      {/* 1. HERO SECTION SKELETON */}
      <div className="relative h-150 bg-gray-200 flex flex-col items-center justify-center text-center px-6">
        {/* Hero Text Placeholders */}
        <div className="h-16 md:h-24 w-3/4 max-w-4xl bg-gray-300 rounded-2xl mb-6"></div>
        <div className="h-6 md:h-8 w-1/2 max-w-md bg-gray-300 rounded-lg"></div>

        {/* Floating Search Bar Skeleton */}
        <div className="absolute -bottom-10 w-full max-w-5xl px-4 z-20">
          <div className="bg-white p-6 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Input Placeholders (Location, Date, Duration) */}
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 border-r border-gray-100 px-4"
              >
                {/* Icon Placeholder */}
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                {/* Text Placeholders */}
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-12 bg-gray-200 rounded-full"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            ))}

            {/* Button Placeholder */}
            <div className="w-full h-14 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* 2. DESTINATIONS GRID SKELETON */}
      <div className="max-w-7xl mx-auto px-6 pt-36 pb-24">
        {/* Section Title Skeleton */}
        <div className="flex flex-col items-center mb-20">
          <div className="h-10 md:h-14 w-64 md:w-96 bg-gray-300 rounded-xl"></div>
          {/* Title Underline Placeholder */}
          <div className="w-24 h-1.5 bg-gray-300 mt-6 rounded-full"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Map out 6 placeholder cards to match your 6 mock database entries */}
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div
              key={index}
              className="bg-white rounded-4xl overflow-hidden shadow-sm border border-gray-50"
            >
              {/* Card Image Area */}
              <div className="relative h-72 bg-gray-200">
                {/* Price Badge Placeholder */}
                <div className="absolute top-6 right-6 bg-gray-300 h-8 w-16 rounded-full"></div>
              </div>

              {/* Card Content Area */}
              <div className="p-8">
                {/* Location Tag */}
                <div className="h-3 w-20 bg-gray-200 rounded-full mb-4"></div>

                {/* Destination Title */}
                <div className="h-7 w-3/4 bg-gray-300 rounded-lg mb-4"></div>

                {/* Description (2 lines to match line-clamp-2) */}
                <div className="space-y-3 mb-8">
                  <div className="h-3 w-full bg-gray-200 rounded-md"></div>
                  <div className="h-3 w-5/6 bg-gray-200 rounded-md"></div>
                </div>

                {/* Card Footer (Duration & Link) */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                  {/* Duration Placeholder */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded-md"></div>
                  </div>
                  {/* View Itinerary Placeholder */}
                  <div className="h-3 w-24 bg-gray-300 rounded-md"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
