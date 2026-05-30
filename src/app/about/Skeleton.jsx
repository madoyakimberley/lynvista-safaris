export default function Skeleton() {
  return (
    <div className="animate-pulse space-y-12">
      {/* Hero Skeleton */}
      <div className="h-[60vh] w-full bg-[#e8e4d9]"></div>

      {/* Story Section Skeleton */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        <div className="space-y-4">
          <div className="h-8 bg-[#e8e4d9] w-1/3 rounded"></div>
          <div className="h-4 bg-[#e8e4d9] w-full rounded"></div>
          <div className="h-4 bg-[#e8e4d9] w-full rounded"></div>
          <div className="h-4 bg-[#e8e4d9] w-3/4 rounded"></div>
        </div>
        <div className="h-[400px] bg-[#e8e4d9] rounded-lg"></div>
      </div>

      {/* Grid Features Skeleton */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
        <div className="h-[300px] bg-[#e8e4d9] rounded-xl"></div>
        <div className="h-[300px] bg-[#1f1610]/10 rounded-xl"></div>
      </div>

      {/* Contact Section Skeleton */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div className="h-[200px] bg-[#e8e4d9] rounded-xl"></div>
        <div className="h-[300px] bg-[#e8e4d9] rounded-xl"></div>
      </div>
    </div>
  );
}
