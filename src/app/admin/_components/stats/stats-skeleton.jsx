export default function StatsSkeleton() {
  return (
    <div className="w-full animate-pulse text-[#3A2E26] font-sans">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div className="w-64 h-12 bg-gray-200 rounded-lg" />
        <div className="flex gap-4">
          <div className="w-32 h-10 bg-gray-200 rounded-lg" />
          <div className="w-32 h-10 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Stats Cards Skeleton (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 p-6 rounded-2xl h-32" />
        ))}
      </div>

      {/* Main Dashboard Split Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column Skeleton */}
        <div className="xl:col-span-8 bg-white border border-gray-100 rounded-2xl p-8 h-96" />

        {/* Right Column Skeleton */}
        <div className="xl:col-span-4 space-y-8">
          <div className="bg-gray-800 rounded-2xl p-8 h-48" />
          <div className="bg-gray-100 rounded-2xl p-8 h-64" />
        </div>
      </div>
    </div>
  );
}
