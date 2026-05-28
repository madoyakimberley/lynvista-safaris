export default function StatsSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-6 rounded-xl shadow bg-white h-[140px]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-4 bg-gray-100 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}
