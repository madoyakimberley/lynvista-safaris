import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Received!
        </h1>
        <p className="text-gray-500 mb-8">
          Your booking is now confirmed. We've sent a confirmation email with
          your itinerary to your inbox.
        </p>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-[#c4a47c] text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-md"
          >
            Return to Homepage
          </Link>

          <p className="text-xs text-gray-400">
            Need help? Contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
