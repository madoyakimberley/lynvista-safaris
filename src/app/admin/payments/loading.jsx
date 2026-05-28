import PaymentsSkeleton from "./_components/PaymentsSkeleton";

export default function Loading() {
  return (
    <div className="p-8 space-y-10">
      {/* Simulate the page title */}
      <div className="h-10 w-64 bg-gray-200 rounded animate-pulse"></div>

      {/* Show the skeleton grid */}
      <PaymentsSkeleton />
    </div>
  );
}
