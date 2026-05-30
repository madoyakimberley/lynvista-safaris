export default function Skeleton() {
  return (
    <div className="bg-[#FAF9F4] min-h-screen animate-pulse">
      {/* 1. HERO SKELETON */}
      <div className="h-[550px] w-full bg-gray-200" />

      {/* 2. MASONRY GRID SKELETON */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Title area */}
        <div className="mb-16">
          <div className="h-10 w-64 bg-gray-300 rounded mb-4" />
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[260px]">
          {/* Repeating placeholders to mimic your masonry pattern */}
          <div className="md:col-span-6 md:row-span-2 bg-gray-200 rounded-xl" />
          <div className="md:col-span-6 md:row-span-1 bg-gray-200 rounded-xl" />
          <div className="md:col-span-4 md:row-span-1 bg-gray-200 rounded-xl" />
          <div className="md:col-span-8 md:row-span-1 bg-gray-200 rounded-xl" />
          <div className="md:col-span-5 md:row-span-2 bg-gray-200 rounded-xl" />
          <div className="md:col-span-7 md:row-span-2 bg-gray-200 rounded-xl" />
        </div>
      </div>

      {/* 3. FOOTER SKELETON */}
      <div className="py-20 px-6 border-t border-gray-200">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="h-8 w-80 bg-gray-300 rounded mb-6" />
          <div className="h-4 w-full max-w-lg bg-gray-200 rounded mb-10" />
          <div className="flex gap-4">
            <div className="h-12 w-48 bg-gray-300 rounded" />
            <div className="h-12 w-48 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
