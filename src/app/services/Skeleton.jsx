import React from "react";

export default function Skeleton() {
  return (
    <div className="min-h-screen bg-(--color-light) animate-pulse relative w-full overflow-hidden">
      {/* 1. HERO SECTION SKELETON */}
      {/* Matches the h-125 height and centered text layout */}
      <div className="relative h-125 bg-gray-200 flex flex-col items-center justify-center text-center px-4">
        {/* Title Placeholder */}
        <div className="h-16 md:h-20 w-3/4 max-w-md bg-gray-300 rounded-2xl mb-6"></div>
        {/* Subtitle Lines Placeholders */}
        <div className="h-6 md:h-8 w-5/6 max-w-2xl bg-gray-300 rounded-lg"></div>
        <div className="h-6 md:h-8 w-4/6 max-w-xl bg-gray-300 rounded-lg mt-3"></div>
      </div>

      {/* 2. SERVICES GRID SKELETON */}
      {/* Matches the max-w-7xl, -mt-16 overlap, and 4-column grid */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* We'll render 8 skeleton cards to fill the grid nicely */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-80"
            >
              {/* Card Image/Icon Area Placeholder */}
              <div className="h-40 bg-gray-200 w-full shrink-0"></div>

              {/* Card Content Area */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Title */}
                <div className="h-6 w-3/4 bg-gray-300 rounded-md mb-4 shrink-0"></div>
                {/* Description lines */}
                <div className="space-y-3 w-full">
                  <div className="h-3 w-full bg-gray-200 rounded-sm"></div>
                  <div className="h-3 w-5/6 bg-gray-200 rounded-sm"></div>
                  <div className="h-3 w-4/6 bg-gray-200 rounded-sm"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
