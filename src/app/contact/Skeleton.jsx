"use client";

export default function Skeleton() {
  return (
    <div className="bg-[#FAF9F4] min-h-screen animate-pulse">
      {/* 1. HERO SECTION SKELETON */}
      <div className="relative h-[500px] w-full bg-gray-300 flex flex-col items-center justify-center text-center px-6">
        <div className="h-12 md:h-16 w-3/4 md:w-[600px] bg-gray-400 rounded-md mb-6"></div>
        <div className="h-5 md:h-6 w-full md:w-[500px] bg-gray-400 rounded-md mb-2"></div>
      </div>

      {/* 2. GRID LAYOUT SKELETON */}
      <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left Column: Direct Access Details */}
        <div className="lg:col-span-5 space-y-8">
          <div className="h-8 w-64 bg-gray-300 rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-200 p-6 rounded-xl h-[100px]"
              ></div>
            ))}
          </div>
        </div>

        {/* Right Column: Form Card */}
        <div className="lg:col-span-7 bg-white p-12 rounded-2xl h-[500px]">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-14 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* 3. OFFICE SECTION SKELETON */}
      <section className="bg-[#12110e] py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="h-64 bg-gray-800 rounded-lg"></div>
          <div className="h-64 bg-gray-800 rounded-lg"></div>
        </div>
      </section>
    </div>
  );
}
