"use client";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Calendar,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import ConfirmationSkeleton from "./Skeleton";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setError("No booking reference found.");
      setIsLoading(false);
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch booking");
        }

        const dbData = await response.json();

        // Format dates from YYYY-MM-DD to "Sept 12"
        const formatDate = (dateString) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
        };
        const year = dbData.travel_end_date
          ? new Date(dbData.travel_end_date).getFullYear()
          : new Date().getFullYear();

        // Construct the travelers string dynamically from DB columns
        let travelersStr = `${dbData.adults || 0} Adult${dbData.adults !== 1 ? "s" : ""}`;
        if (dbData.children > 0) {
          travelersStr += `, ${dbData.children} Child${dbData.children > 1 ? "ren" : ""}`;
        }

        // Map your exact DB columns to the UI state
        setBookingData({
          bookingId: `#LYN-${dbData.id}`,
          safariType: dbData.tour_package,
          dates: `${formatDate(dbData.travel_start_date)} — ${formatDate(dbData.travel_end_date)}, ${year}`,
          travelers: travelersStr,
          mpesaRef: dbData.payment_reference,
        });
      } catch (err) {
        console.error("Error fetching booking data:", err);
        setError(
          "Unable to load your reservation details. Please check your email for confirmation.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  return (
    <main className="min-h-screen bg-[#fcfaf7] font-sans">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0">
          <Image
            src="/images/Confirmation.WebP" // Ensure this path is correct in your /public folder
            alt="Booking Confirmation Background"
            fill
            priority
            className="object-cover brightness-[0.45]"
            sizes="100vw"
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="text-[#d4af37] text-sm font-bold tracking-[0.2em] uppercase mb-4 block">
            Booking Confirmed
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-wide mb-6 leading-tight">
            Your African Odyssey <br /> Awaits
          </h1>
          <p className="text-base md:text-lg text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Thank you for choosing Lynvista Safaris.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative z-20 max-w-6xl mx-auto px-4 pb-24 -mt-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Left Column: Reservation Details */}
          <div className="md:col-span-3 bg-[#f6f4ee] p-8 md:p-10 rounded-2xl border border-[#e8e4d9]">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-serif text-[#5c3e1c]">
                Reservation Details
              </h2>
              <span className="bg-[#f0e6d2] text-[#8c6b23] text-sm font-bold px-4 py-1.5 rounded-full">
                Confirmed
              </span>
            </div>

            {isLoading ? (
              <ConfirmationSkeleton />
            ) : error ? (
              <div className="flex items-center gap-3 text-red-700 bg-red-50 p-4 rounded-xl border border-red-200">
                <AlertCircle className="w-6 h-6" />
                <p className="font-medium">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Booking ID
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {bookingData?.bookingId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Safari Type
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {bookingData?.safariType}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Requested Dates
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {bookingData?.dates}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Travelers
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {bookingData?.travelers}
                  </p>
                </div>

                {/* M-Pesa Reference Block */}
                <div className="col-span-2 pt-4 border-t border-[#e8e4d9]/50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    M-Pesa Transaction
                  </p>
                  <p className="text-sm font-mono text-[#8c6b23] bg-[#f0e6d2] inline-block px-3 py-1 rounded">
                    {bookingData?.mpesaRef || "Pending"}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-[#e8e4d9]">
              <p className="text-gray-500 italic text-sm">
                "A refined editorial approach to safari travel, where every
                detail is curated for the discerning traveler."
              </p>
            </div>
          </div>

          {/* Right Column: Next Steps & Actions */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="bg-[#1f1610] text-[#fcfaf7] p-8 md:p-10 rounded-2xl flex-grow">
              <h3 className="text-2xl font-serif text-[#d4af37] mb-8">
                Next Steps
              </h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-gray-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">
                      Specialist Consultation
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      A dedicated safari specialist will reach out via email
                      within 24 hours to review your preferences.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Calendar className="w-6 h-6 text-gray-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">
                      Itinerary Refinement
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      We will finalize your bespoke itinerary, selecting the
                      most exclusive lodges and private guides.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <ShieldCheck className="w-6 h-6 text-gray-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-1">
                      Secure Confirmation
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Once you approve the plan, we will secure your bookings
                      with our premium conservation partners.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/destinations"
              className="bg-[#785918] hover:bg-[#5c4412] text-white flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-colors"
            >
              Explore More Destinations <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/"
              className="bg-transparent border border-[#d3cec4] hover:bg-[#e8e4d9] text-[#1f1610] flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// Wrap the main content in Suspense to prevent Next.js build errors when using useSearchParams
export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fcfaf7] flex items-center justify-center text-[#5c3e1c]">
          Loading your reservation...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
