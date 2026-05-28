import React from "react";

export default function Skeleton() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] animate-pulse relative w-full px-6 py-16">
      {/* Hero Skeleton */}
      <div className="max-w-7xl mx-auto w-full h-[500px] bg-gray-200 rounded-xl mb-16" />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-12">
          <div className="h-10 w-1/3 bg-gray-200 rounded-lg" />
        </div>

        {/* This grid uses the same logic as the main page.
          We include a mix of standard and double-height blocks.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          <div className="bg-gray-200 rounded-xl md:row-span-2" />
          <div className="bg-gray-200 rounded-xl row-span-1" />
          <div className="bg-gray-200 rounded-xl row-span-1" />
          <div className="bg-gray-200 rounded-xl md:row-span-2" />
          <div className="bg-gray-200 rounded-xl row-span-1" />
          <div className="bg-gray-200 rounded-xl row-span-1" />
        </div>
      </div>
    </div>
  );
}
