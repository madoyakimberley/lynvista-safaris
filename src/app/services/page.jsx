"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import ServiceCard from "./_components/cards/service-card";
import { ServiceModal } from "./_components/modals/ServiceModal";
import useStaticServices from "../hooks/useStaticServices";
import Skeleton from "../_components/Skeleton/page";

export default function ServicesPage() {
  const { services } = useStaticServices();
  const [selectedService, setSelectedService] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  const zoomOut = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div className="min-h-screen bg-(--color-light) relative">
      {/* 1. FULL PAGE SKELETON (Visible until Hero image loads) */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 bg-white">
          <Skeleton />
        </div>
      )}

      {/* 2. THE ACTUAL CONTENT */}
      <div
        className={`transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {/* Hero Header Section */}
        <section className="relative h-125 flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-black">
          {/* Using Next.js Image to trigger the "isLoaded" state */}
          <Image
            src="/images/safari.WebP"
            alt="Safari Hero"
            fill
            className="object-cover opacity-60"
            onLoadingComplete={() => setIsLoaded(true)}
            priority
          />

          <motion.div
            variants={zoomOut}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 font-heading text-(--color-secondary-orange)">
              Our Services
            </h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.2, duration: 0.8 }}
              className="max-w-2xl text-white/90 text-lg md:text-xl leading-relaxed"
            >
              Experience the heart of Africa with our expertly curated safari
              packages, tailored to provide unforgettable adventures and luxury
              comfort.
            </motion.p>
          </motion.div>
        </section>

        {/* Grid Section */}
        <div
          id="grid-section"
          className="max-w-7xl mx-auto px-6 -mt-16 pb-20 relative z-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ scale: 1.03 }}
              >
                <ServiceCard
                  service={service}
                  onClick={() => setSelectedService(service)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modal logic */}
        {selectedService && (
          <ServiceModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            id="service-modal"
          />
        )}
      </div>
    </div>
  );
}
