export default function ConfirmationSkeleton() {
  return (
    <div className="animate-pulse w-full space-y-8">
      {/* Header/Title Skeleton */}
      <div className="h-8 bg-[#e8e4d9] rounded w-1/3 mb-10"></div>

      {/* Grid of Details */}
      <div className="grid grid-cols-2 gap-y-10 gap-x-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-[#e8e4d9] rounded w-1/4"></div>
            <div className="h-6 bg-[#d3cec4] rounded w-3/4"></div>
          </div>
        ))}

        {/* M-Pesa Ref Skeleton */}
        <div className="col-span-2 pt-4 border-t border-[#e8e4d9]/50 space-y-2">
          <div className="h-3 bg-[#e8e4d9] rounded w-1/6"></div>
          <div className="h-8 bg-[#d3cec4] rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}
