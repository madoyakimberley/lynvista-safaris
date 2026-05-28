"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "./Skeleton.jsx";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState(null);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch("/api/tours");
        const data = await res.json();
        setDestinations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching destinations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, []);

  if (loading) return <Skeleton />;

  // The 6-step repeating pattern for the masonry grid
  const masonryPattern = [
    "md:col-span-6 md:row-span-2",
    "md:col-span-6 md:row-span-1",
    "md:col-span-4 md:row-span-1",
    "md:col-span-8 md:row-span-1",
    "md:col-span-5 md:row-span-2",
    "md:col-span-7 md:row-span-2",
  ];

  return (
    <div className="bg-[#FAF9F4] min-h-screen text-[#3A2E26] font-sans selection:bg-[#c19b6c] selection:text-white overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <div className="relative h-[550px] w-full flex items-center justify-start overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/tourdest.WebP"
            alt="Curated Destinations Hero"
            fill
            priority
            className="object-cover brightness-90"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-left">
          <p className="uppercase tracking-[0.3em] text-[11px] font-bold text-[#e9bc47] mb-3">
            Iconic Kenyan Wonders
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-wide leading-none">
            Curated Destinations
          </h1>
          <p className="mt-6 text-base md:text-lg max-w-xl text-white/90 leading-relaxed font-medium drop-shadow-sm">
            From the rolling plains of the Mara to the crystalline waters of
            Diani, explore the diverse landscapes that define the heart of
            Africa.
          </p>
        </div>
      </div>

      {/* 2. MASONRY GRID SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16 border-b border-[#3A2E26]/10 pb-8">
          <h2 className="text-4xl font-serif font-bold text-[#4a3219] mb-2">
            Discover Your Ideal Journey
          </h2>
          <p className="text-[#a48665] text-sm font-medium">
            Explore handpicked premium travel destinations.
          </p>
        </div>

        {/* Dynamic Editorial Grid layout mapping explicitly to your dataset */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 auto-rows-[260px]">
          {destinations.map((dest, index) => {
            // Modulo operator ensures the pattern repeats seamlessly for infinite admin entries
            const gridSpan = masonryPattern[index % masonryPattern.length];

            return (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
                className={`relative group overflow-hidden rounded-xl cursor-pointer shadow-sm ${gridSpan}`}
                onClick={() => setSelectedDestination(dest)}
              >
                <Image
                  src={dest.image}
                  alt={dest.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-8 flex flex-col justify-end">
                  <span className="text-[#e9bc47] text-[10px] uppercase tracking-widest font-bold mb-1 opacity-90">
                    Wildlife & Culture
                  </span>
                  <h3 className="text-white text-2xl font-serif font-bold mb-2">
                    {dest.title}
                  </h3>
                  <p className="text-white/80 text-xs font-medium mb-4 line-clamp-2 max-w-md">
                    {dest.description}
                  </p>
                  <div className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-[#e9bc47] transition-colors">
                    <span>Explore Experience</span>
                    <span className="text-sm">→</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. COMPACT FOOTER ACTION BAR */}
      <section className="bg-gradient-to-b from-[#FAF9F4] to-[#f5ebe2] py-20 px-6 text-center border-t border-[#3A2E26]/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-[#4a3219]">
            Ready for an Unforgettable Adventure?
          </h2>
          <p className="mb-10 text-base text-[#64564b] max-w-xl mx-auto leading-relaxed">
            Our travel experts are available around the clock to assist with
            bookings, changes, emergencies, and travel guidance tailored just
            for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              // Using comma-separated tel: links allows mobile devices to offer a selection or dial the first number
              href="tel:+254718108358, +254793696522"
              className="px-8 py-3.5 bg-[#e9bc47] text-black font-bold uppercase text-xs tracking-widest rounded shadow-sm hover:bg-[#d9ab36] transition-colors flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 004.817 4.817l.773-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-1C9.716 18 2 11.284 2 3z" />
              </svg>
              Call: +254 718 108 358
            </a>
            <Link
              href="/book"
              className="px-8 py-3.5 border border-[#4a3219] bg-white text-[#4a3219] font-bold uppercase text-xs tracking-widest rounded hover:bg-[#4a3219] hover:text-white transition-all w-full sm:w-auto justify-center flex items-center gap-3"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Book a Trip
            </Link>
          </div>
          <p className="mt-4 text-[10px] text-[#a48665] font-bold uppercase tracking-widest">
            Secondary Line: +254 793 696 522
          </p>
        </div>
      </section>

      {/* 4. PREMIUM SPLIT MODAL */}
      <AnimatePresence>
        {selectedDestination && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedDestination(null)}
            />

            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="bg-white rounded-xl overflow-hidden max-w-5xl w-full shadow-2xl relative z-10 flex flex-col md:flex-row h-[90vh] md:h-[620px]"
            >
              {/* Dismiss button */}
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-5 right-5 z-30 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-[#3A2E26] transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Left Column: Image Area */}
              <div className="relative w-full md:w-[45%] h-64 md:h-full shrink-0">
                <Image
                  src={selectedDestination.image}
                  alt={selectedDestination.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>

              {/* Right Column: Clean Luxury Info Layout */}
              <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-between overflow-y-auto bg-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a48665] mb-2">
                    Private Journey
                  </p>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4a3219] mb-4 tracking-wide">
                    {selectedDestination.title}
                  </h2>
                  <p className="text-[#64564b] text-sm md:text-[15px] leading-relaxed mb-8 font-medium">
                    {selectedDestination.description}
                  </p>

                  <div className="grid grid-cols-2 gap-6 border-t border-[#3A2E26]/10 pt-8 mb-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#a48665] mb-1">
                        Adventure Duration
                      </p>
                      <p className="text-base font-bold text-[#3A2E26]">
                        {selectedDestination.duration || "Custom Days"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#a48665] mb-1">
                        Destination Hub
                      </p>
                      <p className="text-base font-bold text-[#3A2E26]">
                        Kenya, East Africa
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#3A2E26]/10 pt-6 flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#a48665]">
                      Starting From
                    </p>
                    <p className="text-xl font-serif font-bold text-[#4a3219]">
                      ${selectedDestination.base_price || "1,250"}{" "}
                      <span className="text-xs font-sans text-[#64564b] font-medium">
                        / person
                      </span>
                    </p>
                  </div>

                  <Link
                    href="/book"
                    className="px-6 py-3 bg-[#5c4021] text-white font-bold uppercase text-xs tracking-widest rounded shadow-md hover:bg-[#4a3219] transition-all flex items-center gap-3"
                  >
                    <span>Book This Adventure</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
