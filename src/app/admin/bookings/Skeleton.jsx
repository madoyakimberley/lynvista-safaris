export default function BookingsSkeleton() {
  return (
    <div className="animate-pulse w-full">
      <div className="w-full border-collapse">
        {/* Header Skeleton */}
        <div className="border-b-2 border-gray-200 pb-4 mb-4 flex justify-between">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-20"></div>
          ))}
        </div>

        {/* Rows Skeleton */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between py-6 border-b border-gray-100"
          >
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/12"></div>
            <div className="h-4 bg-gray-200 rounded w-1/12"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-8 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
