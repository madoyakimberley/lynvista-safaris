export default function TourSkeleton() {
  return (
    <div className="bg-[#fffdfa] rounded-xl overflow-hidden shadow-sm border border-[#ede7d9] flex flex-col h-full min-h-[400px]">
      {/* Image Skeleton */}
      <div className="h-56 w-full bg-gray-200 animate-pulse relative">
        {/* Badge Skeleton */}
        <div className="absolute top-4 left-4 h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Title Skeleton */}
        <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>

        {/* Description Skeleton (Lines) */}
        <div className="space-y-2 mb-6">
          <div className="h-3 w-full bg-gray-100 rounded animate-pulse"></div>
          <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse"></div>
        </div>

        {/* Footer Data Skeleton */}
        <div className="flex justify-between items-end border-t border-[#ede7d9] pt-4 mt-auto">
          <div className="space-y-1.5">
            {/* Label */}
            <div className="h-2 w-16 bg-gray-200 rounded animate-pulse"></div>
            {/* Price */}
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
