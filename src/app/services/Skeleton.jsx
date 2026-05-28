import React from "react";

export default function Skeleton() {
  return (
    <div className="bg-[#FAF9F4] min-h-screen animate-pulse overflow-hidden w-full">
      {/* 1. HERO SECTION SKELETON */}
      {/* Matches the h-[600px] height and centered text/buttons layout */}
      <div className="relative h-[600px] bg-gray-300 flex flex-col items-center justify-center text-center px-4">
        {/* Title Placeholders */}
        <div className="h-16 md:h-20 w-3/4 max-w-2xl bg-gray-400 rounded-lg mb-6 mt-12"></div>
        {/* Subtitle Placeholder */}
        <div className="h-6 md:h-8 w-5/6 max-w-xl bg-gray-400 rounded-md mb-10"></div>
        {/* Buttons Placeholder */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="h-12 w-48 bg-gray-400 rounded"></div>
          <div className="h-12 w-48 bg-gray-400 rounded"></div>
        </div>
      </div>

      {/* 2. SERVICES GRID SKELETON */}
      {/* Matches the 2-column grid with soft padded cards and top text headers */}
      <div className="max-w-7xl mx-auto py-24 px-6">
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="h-3 w-32 bg-gray-300 rounded mb-4"></div>
          <div className="h-10 md:h-12 w-3/4 max-w-md bg-gray-300 rounded mb-6"></div>
          <div className="w-24 h-1 bg-gray-300 rounded"></div>
        </div>

        {/* 2-Column Grid (Rendering 4 dummy cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className="bg-[#fcf7f2] p-10 rounded-lg flex flex-col gap-6 shadow-sm border border-transparent"
            >
              {/* Icon Box */}
              <div className="w-12 h-12 bg-gray-200 rounded-md shrink-0"></div>

              {/* Content Area */}
              <div>
                {/* Title */}
                <div className="h-8 w-2/3 bg-gray-300 rounded mb-4 shrink-0"></div>
                {/* Description lines */}
                <div className="space-y-3 w-full">
                  <div className="h-4 w-full bg-gray-200 rounded-sm"></div>
                  <div className="h-4 w-11/12 bg-gray-200 rounded-sm"></div>
                  <div className="h-4 w-4/5 bg-gray-200 rounded-sm"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. DARK CTA / WHY CHOOSE US SKELETON */}
      {/* Matches the dark bg, left feature list, and right 500px image block */}
      <div className="py-24 bg-[#231d18]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <div className="h-3 w-40 bg-gray-700 rounded mb-4"></div>
              <div className="h-12 w-full bg-gray-700 rounded mb-6"></div>
              <div className="h-16 w-5/6 bg-gray-700 rounded"></div>
            </div>

            <div className="space-y-6 pt-4">
              {/* Feature Rows */}
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex gap-5">
                  <div className="w-10 h-10 bg-gray-700 rounded shrink-0"></div>
                  <div className="w-full">
                    <div className="h-5 w-1/2 bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Block */}
          <div className="relative mt-10 lg:mt-0 h-[500px] w-full bg-gray-700 rounded-lg">
            {/* Inner Floating Card Placeholder */}
            <div className="absolute bottom-6 -left-4 md:-left-8 bg-gray-600 w-64 h-32 rounded shadow-xl"></div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM CTA SKELETON */}
      {/* Matches the gradient bottom CTA block */}
      <div className="py-24 px-6 flex flex-col items-center">
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center">
          <div className="h-10 md:h-12 w-3/4 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 w-full max-w-lg bg-gray-200 rounded mb-10"></div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 w-full">
            <div className="h-12 w-full sm:w-48 bg-gray-300 rounded"></div>
            <div className="h-12 w-full sm:w-48 bg-gray-300 rounded"></div>
          </div>

          <div className="h-5 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
