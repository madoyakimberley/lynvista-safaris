import React from "react";

export default function Skeleton() {
  return (
    <div className="min-h-screen bg-[#fdfbf7] py-20 px-6 animate-pulse">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN: Form Inputs Simulator */}
        <div className="lg:col-span-2 space-y-8">
          <div className="h-10 w-2/3 bg-gray-200 rounded-lg"></div>
          <div className="h-6 w-1/2 bg-gray-200 rounded-lg"></div>

          <div className="space-y-6 pt-6">
            <div className="h-16 w-full bg-gray-200 rounded-xl"></div>
            <div className="h-64 w-full bg-gray-100 rounded-xl"></div>
          </div>
        </div>

        {/* RIGHT COLUMN: Trip Summary Sidebar Simulator */}
        <div className="lg:col-span-1">
          <div className="bg-[#2d1b0b]/80 h-[400px] w-full rounded-xl p-8 space-y-8">
            <div className="h-8 w-1/2 bg-[#442c23] rounded"></div>
            <div className="space-y-6">
              <div className="h-4 w-3/4 bg-[#442c23] rounded"></div>
              <div className="h-4 w-1/2 bg-[#442c23] rounded"></div>
              <div className="h-4 w-2/3 bg-[#442c23] rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
