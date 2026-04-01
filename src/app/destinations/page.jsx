"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, MapPin, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Skeleton from "../_components/Skeleton/page";

export default function DestinationsPage() {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // FALLBACK: If the image is cached, onLoadingComplete might not fire.
  // This ensures the skeleton hides regardless after a short delay.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000); // 2-second safety fallback
    return () => clearTimeout(timer);
  }, []);

  const destinations = [
    {
      id: 1,
      title: "Safari Packages",
      description:
        "Explore Kenya’s top safari destinations: Maasai Mara, Amboseli, Tsavo, Samburu, Lake Nakuru, etc.",
      base_price: 500,
      duration: "3 Days",
      location: "Kenya",
      image: "/images/dest1.WebP",
    },
    {
      id: 2,
      title: "Cultural & Community Tours",
      description: "Immerse in local culture and communities across Kenya.",
      base_price: 300,
      duration: "2 Days",
      location: "Kenya",
      image: "/images/dest2.WebP",
    },
    {
      id: 3,
      title: "Group Tours & Excursions",
      description: "Perfect for friends, families, or corporate groups.",
      base_price: 400,
      duration: "2-5 Days",
      location: "Kenya",
      image: "/images/dest3.WebP",
    },
    {
      id: 4,
      title: "Domestic Tours & Weekend Getaways",
      description: "Quick escapes and domestic trips around Kenya.",
      base_price: 200,
      duration: "1-2 Days",
      location: "Kenya",
      image: "/images/dest4.WebP",
    },
    {
      id: 5,
      title: "International Holiday Packages",
      description: "Travel beyond Kenya with curated international packages.",
      base_price: 1000,
      duration: "5-10 Days",
      location: "Various",
      image: "/images/dest5.WebP",
    },
    {
      id: 6,
      title: "Student Travel & Educational Tours",
      description:
        "Educational trips and guided learning experiences for students.",
      base_price: 250,
      duration: "2-7 Days",
      location: "Kenya",
      image: "/images/dest6.WebP",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-(--color-light) relative">
      {/* 1. FULL PAGE SKELETON (Visible until image loads or timeout) */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 bg-white">
          <Skeleton />
        </div>
      )}

      {/* 2. THE ACTUAL CONTENT */}
      <div
        className={`transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {/* HERO SECTION */}
        <div className="relative h-150 flex flex-col items-center justify-center text-center px-6">
          <Image
            src="/images/tourdest.WebP"
            alt="Destinations Hero"
            fill
            className="object-cover"
            onLoadingComplete={() => setIsLoaded(true)}
            priority
            unoptimized={process.env.NODE_ENV === "development"} // Helps with local build testing
          />
          <div className="absolute inset-0 bg-black/40 z-0"></div>

          <motion.div
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <h1
              className="text-6xl md:text-8xl font-black text-(--color-text-gold) mb-4 tracking-tighter drop-shadow-2xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your Dream Vacation Awaits
            </h1>
            <p className="text-xl md:text-2xl text-white/95 italic font-heading">
              Explore the World with us.
            </p>
          </motion.div>

          {/* FLOATING SEARCH BAR */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute -bottom-10 w-full max-w-5xl px-4 z-20"
          >
            <div className="bg-white p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center gap-3 border-r border-gray-100 px-4">
                <MapPin className="text-(--color-secondary-orange)" size={22} />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                    Location
                  </p>
                  <p className="text-sm font-bold text-(--color-dark)">
                    Where to?
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-r border-gray-100 px-4">
                <Calendar
                  className="text-(--color-secondary-orange)"
                  size={22}
                />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                    Date
                  </p>
                  <p className="text-sm font-bold text-(--color-dark)">
                    Select Date
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-r border-gray-100 px-4">
                <Clock className="text-(--color-secondary-orange)" size={22} />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                    Duration
                  </p>
                  <p className="text-sm font-bold text-(--color-dark)">
                    Any Length
                  </p>
                </div>
              </div>
              <a href="/book" className="w-full">
                <button className="w-full bg-(--color-primary-green) hover:bg-(--color-primary) text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg">
                  <Search size={20} strokeWidth={3} />
                  BOOK NOW
                </button>
              </a>
            </div>
          </motion.div>
        </div>

        {/* DESTINATIONS GRID */}
        <div className="max-w-7xl mx-auto px-6 pt-36 pb-24">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-20"
          >
            <h2
              className="text-4xl md:text-6xl font-black text-(--color-dark) italic"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Popular Destinations
            </h2>
            <div className="w-24 h-1.5 bg-(--color-secondary-orange) mx-auto mt-6 rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.12 }}
                whileHover={{ y: -12 }}
                className="group bg-white rounded-4xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-50"
                onClick={() => setSelectedDestination(dest)}
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index < 3}
                  />
                  <div className="absolute top-6 right-6 bg-(--color-secondary-orange) text-white px-5 py-1.5 rounded-full font-black text-sm shadow-xl">
                    ${dest.base_price}
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 text-(--color-primary-green) text-xs font-black uppercase tracking-[0.2em] mb-3">
                    <MapPin size={14} /> {dest.location}
                  </div>
                  <h3
                    className="text-2xl font-bold text-(--color-dark) mb-3 leading-tight group-hover:text-(--color-primary-green) transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {dest.title}
                  </h3>
                  <p className="text-base text-(--color-dark-muted) line-clamp-2 leading-relaxed mb-6">
                    {dest.description}
                  </p>
                  <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                    <span className="flex items-center gap-2 text-sm font-bold text-gray-400">
                      <Clock size={16} /> {dest.duration}
                    </span>
                    <span className="text-(--color-primary-green) font-black text-sm tracking-tighter uppercase group-hover:underline">
                      View Itinerary →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PREMIUM MODAL */}
        <AnimatePresence>
          {selectedDestination && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={() => setSelectedDestination(null)}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-(--color-light) rounded-[40px] overflow-hidden max-w-2xl w-full shadow-2xl relative z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-64 relative">
                  <Image
                    src={selectedDestination.image}
                    alt={selectedDestination.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                  <h2
                    className="absolute bottom-8 left-10 text-4xl font-black text-white italic"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {selectedDestination.title}
                  </h2>
                </div>
                <div className="p-10">
                  <div className="flex gap-4 mb-8">
                    <div className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 text-center">
                      <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">
                        Price From
                      </p>
                      <p className="text-xl font-black text-(--color-secondary-orange)">
                        ${selectedDestination.base_price}
                      </p>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-2xl border border-gray-100 text-center">
                      <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">
                        Timeframe
                      </p>
                      <p className="text-xl font-black text-(--color-dark)">
                        {selectedDestination.duration}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg text-(--color-dark-muted) leading-relaxed mb-10 italic">
                    "{selectedDestination.description}"
                  </p>
                  <a href="/book" className="block w-full">
                    <button className="w-full bg-(--color-primary-green) text-white py-5 rounded-3xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                      Book Now
                    </button>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
