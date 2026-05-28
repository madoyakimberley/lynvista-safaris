export default function SettingsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 p-4 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-20 bg-white rounded-xl shadow-sm border border-gray-100"></div>

      {/* Form Skeleton */}
      <div className="h-24 bg-white rounded-xl shadow-sm border border-gray-100"></div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Admins List Skeleton */}
        <div className="h-96 bg-white rounded-xl shadow-sm border border-gray-100 p-6"></div>
        {/* Logs Skeleton */}
        <div className="h-96 bg-white rounded-xl shadow-sm border border-gray-100 p-6"></div>
      </div>
    </div>
  );
}
