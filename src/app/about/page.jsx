"use client";
import { useState } from "react";
import Image from "next/image";
import Skeleton from "../_components/Skeleton/page";

const AboutUs = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <main className="min-h-screen bg-(--color-light) text-(--color-dark)">
      {/* 1. FULL PAGE SKELETON (Visible until image loads) */}
      {!isLoaded && (
        <div className="fixed inset-0 z-50 bg-white">
          <Skeleton />
        </div>
      )}

      {/* 2. THE ACTUAL CONTENT (Hidden until isLoaded is true) */}
      <div
        className={`transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {/* Hero Container */}
        <section className="relative h-[70vh] w-full overflow-hidden">
          <Image
            src="/images/tourism.WebP"
            alt="Lynvista Safaris Guide"
            fill
            className="object-cover"
            onLoadingComplete={() => setIsLoaded(true)}
            priority
          />

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-5xl md:text-7xl font-heading mb-6 tracking-wide text-(--color-light)">
              About us
            </h1>
          </div>
        </section>

        {/* Text Content Section */}
        <section className="max-w-4xl mx-auto py-16 px-6 text-center">
          <h2 className="text-4xl font-heading text-(--color-accent) mb-8">
            About Lynvista Safaris Limited
          </h2>

          <div className="space-y-6 text-lg leading-relaxed font-body text-(--color-dark-muted)">
            <p>
              At Lynvista Safaris Limited, we believe that a true safari is more
              than just a sighting—it is a profound connection to the wild. Born
              from a deep-rooted passion for the untamed landscapes of East
              Africa, we curate bespoke journeys that bypass the crowded tourist
              circuits in favor of authentic, immersive wilderness experiences.
              We don’t believe in "one size fits all" itineraries; instead, we
              treat every traveler as an individual, hand-crafting escapes that
              align with your specific sense of adventure. Our team consists of
              seasoned explorers and local experts who have spent years
              traversing the savannahs and hidden valleys we now share with you.
              From the first light of a sunrise game drive to the quiet luxury
              of a remote bush camp, we handle every detail with precision and
              care. At Lynvista, we aren't just booking a trip; we are guiding
              you toward the stories and landscapes that will stay with you long
              after you’ve returned home.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutUs;
