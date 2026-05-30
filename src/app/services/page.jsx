"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { DynamicIcon } from "@/app/utils/icon-mapper";
import Skeleton from "./Skeleton";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(Array.isArray(data) ? data.filter((s) => s.is_active) : []);
      } catch (err) {
        console.error("Error loading services:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Animation configuration constants for clean, premium transitions
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (loading) return <Skeleton />;

  return (
    <div className="bg-[#FAF9F4] min-h-screen text-[#3A2E26] font-sans selection:bg-[#c19b6c] selection:text-white overflow-x-hidden">
      {/* 1. HERO HEADER (Animate smoothly on initial page load) */}
      <section className="relative h-[600px] w-full flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/safari.WebP"
          alt="African Odyssey Sunset"
          fill
          sizes="100vw"
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>{" "}
        {/* Subtle overlay */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center mt-12"
        >
          <h1 className="text-white text-5xl md:text-7xl font-serif font-bold tracking-wide leading-tight mb-6 shadow-sm">
            Crafting Your Perfect <br /> African Odyssey
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-medium max-w-2xl mb-10 drop-shadow-md">
            From wild savannahs to pristine coastlines, explore our curated
            travel services designed for the discerning explorer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/destinations"
              className="px-8 py-3 bg-[#6e502a] text-white font-semibold text-sm tracking-wider uppercase rounded hover:bg-[#573e1f] transition-colors"
            >
              Explore Our Safari
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 border border-white/80 text-white font-semibold text-sm tracking-wider uppercase rounded hover:bg-white hover:text-black transition-all"
            >
              Connect an Expert
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. DYNAMIC SERVICES GRID (Cards cascade/stagger dynamically as you scroll down) */}
      <section className="max-w-7xl mx-auto py-24 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <span className="text-[#a48665] text-xs font-bold tracking-[0.2em] uppercase block mb-3">
            Exclusive Offerings
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4a3219]">
            Our Curated Services
          </h2>
          <div className="w-24 h-0.5 bg-[#c19b6c] mx-auto mt-6"></div>
        </motion.div>

        {/* Dynamic stagger mapping for the columns */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={cardItem}
              className="bg-[#fcf7f2] p-10 rounded-lg flex flex-col gap-6 hover:-translate-y-1 transition-transform duration-300 shadow-sm"
            >
              <div className="w-12 h-12 bg-[#f4e8df] rounded-md flex items-center justify-center text-[#8e613b]">
                <DynamicIcon name={service.icon_name} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-[#4a3219] mb-4">
                  {service.name}
                </h3>
                <p className="text-[#64564b] leading-relaxed text-[15px]">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. DARK CTA / WHY CHOOSE US (Left content slides up, right image pops gracefully) */}
      <section className="py-24 bg-[#231d18] text-[#f4ebdf]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content Column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <span className="text-[#c19b6c] text-xs font-bold tracking-[0.2em] uppercase block mb-3">
                The Lynvista Difference
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                Why Choose Lynvista Safaris?
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Your trusted partner for unforgettable African adventures. From
                safaris to beaches, we provide curated travel and custom
                itineraries.
              </p>
            </motion.div>

            <div className="space-y-6 pt-4">
              {/* Feature 1 */}
              <motion.div variants={fadeInUp} className="flex gap-5">
                <div className="w-10 h-10 bg-[#3a2e24] shrink-0 rounded flex items-center justify-center text-[#c19b6c]">
                  <DynamicIcon name="Map" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">
                    Expert Local Knowledge
                  </h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Our guides are born and raised in the regions you visit,
                    providing insights no guidebook can match.
                  </p>
                </div>
              </motion.div>
              {/* Feature 2 */}
              <motion.div variants={fadeInUp} className="flex gap-5">
                <div className="w-10 h-10 bg-[#3a2e24] shrink-0 rounded flex items-center justify-center text-[#c19b6c]">
                  <DynamicIcon name="Headphones" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">
                    24/7 Dedicated Support
                  </h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    From the moment you land until your departure, our concierge
                    team is always a call away.
                  </p>
                </div>
              </motion.div>
              {/* Feature 3 */}
              <motion.div variants={fadeInUp} className="flex gap-5">
                <div className="w-10 h-10 bg-[#3a2e24] shrink-0 rounded flex items-center justify-center text-[#c19b6c]">
                  <DynamicIcon name="Route" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">
                    Seamless Logistics
                  </h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    We coordinate every detail—flights, transfers, and
                    accommodations—so you can simply enjoy the journey.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mt-10 lg:mt-0 h-[500px] w-full rounded-lg overflow-hidden"
          >
            <Image
              src="/images/Services.WebP"
              alt="Lynvista Safari Guide"
              fill
              className="object-cover"
            />
            {/* Overlay Yellow Card with slight spring delay pop */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.4,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              className="absolute bottom-6 -left-4 md:-left-8 bg-[#e9bc47] p-6 md:p-8 rounded shadow-xl max-w-[280px]"
            >
              <h4 className="text-black font-serif font-bold text-2xl italic mb-3">
                "Unforgettable"
              </h4>
              <p className="text-black/80 text-sm leading-relaxed font-medium">
                "Our attention to detail goes beyond anything we expected -
                simply unmatched."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. BOTTOM CTA */}
      <section className="bg-gradient-to-b from-[#FAF9F4] to-[#f5ebe2] py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <h2 className="text-4xl font-serif font-bold text-[#4a3219] mb-4">
            Start Planning Your Journey
          </h2>
          <p className="text-[#64564b] mb-10 text-lg">
            Whether it's your first safari or a return to the continent, let us
            help you create memories that will last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 w-full sm:w-auto">
            <Link
              href="/contact"
              className="px-8 py-3 bg-[#8b6531] text-white font-semibold text-sm tracking-widest uppercase rounded hover:bg-[#6e502a] transition-colors w-full sm:w-auto"
            >
              Book a Consultation
            </Link>
            <Link
              href="/destinations"
              className="px-8 py-3 bg-[#4a3219] text-white font-semibold text-sm tracking-widest uppercase rounded hover:bg-[#332211] transition-colors w-full sm:w-auto"
            >
              View Itineraries
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
