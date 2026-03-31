"use client";

import { useState } from "react";
import { Search, Calendar, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function DestinationsPage() {
  const [selectedDestination, setSelectedDestination] = useState(null);

  const destinations = [
    {
      id: 1,
      title: "Safari Packages",
      description:
        "Explore Kenya’s top safari destinations: Maasai Mara, Amboseli, Tsavo, Samburu, Lake Nakuru, etc.",
      base_price: 500,
      duration: "3 Days",
      location: "Kenya",
      image: "/images/dest1.jpg",
    },
    {
      id: 2,
      title: "Cultural & Community Tours",
      description: "Immerse in local culture and communities across Kenya.",
      base_price: 300,
      duration: "2 Days",
      location: "Kenya",
      image: "/images/dest2.jpg",
    },
    {
      id: 3,
      title: "Group Tours & Excursions",
      description: "Perfect for friends, families, or corporate groups.",
      base_price: 400,
      duration: "2-5 Days",
      location: "Kenya",
      image: "/images/dest3.jpg",
    },
    {
      id: 4,
      title: "Domestic Tours & Weekend Getaways",
      description: "Quick escapes and domestic trips around Kenya.",
      base_price: 200,
      duration: "1-2 Days",
      location: "Kenya",
      image: "/images/dest4.jpg",
    },
    {
      id: 5,
      title: "International Holiday Packages",
      description: "Travel beyond Kenya with curated international packages.",
      base_price: 1000,
      duration: "5-10 Days",
      location: "Various",
      image: "/images/dest5.jpg",
    },
    {
      id: 6,
      title: "Student Travel & Educational Tours",
      description:
        "Educational trips and guided learning experiences for students.",
      base_price: 250,
      duration: "2-7 Days",
      location: "Kenya",
      image: "/images/dest6.jpg",
    },
  ];

  // animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-(--color-light)">
      {/* HERO */}
      <div
        className="relative h-150 flex flex-col items-center justify-center text-center px-6"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('/images/tourdest.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-black text-(--color-text-gold) mb-4 drop-shadow-lg">
            Your Dream Vacation Awaits
          </h1>
          <p className="text-xl md:text-2xl text-white/90 italic">
            Explore the World with us.
          </p>
        </motion.div>

        {/* SEARCH BAR */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-10 w-full max-w-5xl px-4"
        >
          <div className="bg-white p-6 rounded-xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 border-r px-2 text-(--color-dark)">
              <MapPin className="text-orange-500" size={20} />
              <p className="text-sm font-semibold">Where are you going?</p>
            </div>
            <div className="flex items-center gap-3 border-r px-2 text-(--color-dark)">
              <Calendar className="text-orange-500" size={20} />
              <p className="text-sm font-semibold">Select Date</p>
            </div>
            <div className="flex items-center gap-3 border-r px-2">
              <Clock className="text-orange-500" size={20} />
              <p className="text-sm font-semibold text-(--color-dark)">
                Any Duration
              </p>
            </div>
            <a href="/book">
              <button className="bg-(--color-dark-muted) text-white font-bold py-3 rounded-lg flex items-center justify-center gap-3">
                <Search size={20} />
                Book
              </button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* DESTINATIONS */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-(--color-dark) italic">
            Popular Destinations
          </h2>
          <div className="w-20 h-1 bg-orange-500 mx-auto mt-4"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer"
              onClick={() => setSelectedDestination(dest)}
            >
              <div className="relative h-64">
                <img src={dest.image} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1 rounded-full font-bold text-sm">
                  ${dest.base_price}
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-400">{dest.location}</p>
                <h3 className="text-xl font-bold mb-2">{dest.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{dest.description}</p>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{dest.duration}</span>
                  <span className="text-green-700 font-bold">View →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {selectedDestination && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
          onClick={() => setSelectedDestination(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">
              {selectedDestination.title}
            </h2>
            <p className="mb-4">{selectedDestination.description}</p>
            <button className="bg-green-700 text-white px-6 py-3 rounded-lg w-full">
              Book Now
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
