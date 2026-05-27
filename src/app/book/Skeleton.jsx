import React from "react";

export default function Skeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-10 bg-gray-50 animate-pulse w-full">
      {/* Mimics the booking-card wrapper size and structure */}
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-8">
        {/* Form Title & Header */}
        <div className="space-y-3 text-center md:text-left">
          <div className="h-8 w-1/2 bg-gray-300 rounded-lg mx-auto md:mx-0"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded-md mx-auto md:mx-0"></div>
        </div>

        {/* Form Inputs Grid Simulator */}
        <div className="space-y-6">
          {/* Row 1: Two inputs (e.g., Name, Email) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-12 w-full bg-gray-100 rounded-xl"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-12 w-full bg-gray-100 rounded-xl"></div>
            </div>
          </div>

          {/* Row 2: Two inputs (e.g., Date, Destination) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-12 w-full bg-gray-100 rounded-xl"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
              <div className="h-12 w-full bg-gray-100 rounded-xl"></div>
            </div>
          </div>

          {/* Row 3: Full-width input/textarea (e.g., Special Requests) */}
          <div className="space-y-2">
            <div className="h-3 w-1/6 bg-gray-200 rounded"></div>
            <div className="h-28 w-full bg-gray-100 rounded-xl"></div>
          </div>
        </div>

        {/* Action Button Simulator */}
        <div className="pt-4">
          <div className="h-14 w-full bg-gray-300 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
