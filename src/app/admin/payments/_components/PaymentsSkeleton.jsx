export default function PaymentsSkeleton() {
  return (
    <div className="space-y-16 animate-pulse">
      {/* Simulate two sections: Pending and Completed */}
      {[1, 2].map((section) => (
        <div key={section}>
          <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Simulate 3 cards per section */}
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="h-64 bg-gray-100 rounded-xl border border-gray-200"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
