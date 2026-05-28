"use client";
import { useState } from "react";
import Image from "next/image";
import Skeleton from "./Skeleton";

const AboutUs = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <main className="min-h-screen bg-[#fcfaf7] text-[#1f1610]">
      {!isLoaded && (
        <div className="fixed inset-0 z-50 bg-white">
          <Skeleton />
        </div>
      )}

      <div
        className={`transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {/* HERO SECTION */}
        <section className="relative h-[60vh] w-full flex items-center justify-center">
          <Image
            src="/images/tourism.WebP"
            alt="Safari Landscape"
            fill
            className="object-cover"
            onLoadingComplete={() => setIsLoaded(true)}
            priority
          />
          <div className="relative z-10 text-center px-4">
            <span className="text-white/80 uppercase tracking-[0.3em] text-sm mb-2 block">
              Expertise & Passion
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white">
              Crafting Your African Legacy.
            </h1>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section className="max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-serif mb-6 text-[#5c3e1c]">
              Our Story
            </h2>
            <p className="text-[#4a4a4a] leading-relaxed">
              Lynvista Safaris Limited began with a single vision: to bridge the
              gap between raw adventure and refined luxury. Based in the heart
              of Nairobi, we have spent time cultivating relationships with
              local communities and conservation experts to ensure every journey
              we curate is both authentic and sustainable. We don’t just book
              trips; we protect memories, from the mythic roar of the savannah
              to the tranquil whispers of the Indian Ocean; our expertise lies
              in the details that others overlook.
            </p>
          </div>
          <div className="relative h-[400px]">
            <Image
              src="/images/Map.WebP"
              alt="Our Story"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </section>

        {/* WHY TRUST LYNVISTA */}
        <section className="max-w-6xl mx-auto py-20 px-6">
          <h2 className="text-center text-3xl font-serif mb-4 text-[#5c3e1c]">
            Why Trust Lynvista?
          </h2>
          <p className="text-center text-[#4a4a4a] mb-12">
            Providing the reassurance of expert craftsmanship in every mile
            traveled.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#f6f4ee] p-8 border border-[#e8e4d9] rounded-xl">
              <h3 className="font-bold mb-2">Expert Field Knowledge</h3>
              <p className="text-sm mb-4">
                Our guides are more than just drivers; they are naturalists,
                historians, and storytellers...
              </p>
              <div className="relative h-[200px] w-full">
                <Image
                  src="/images/Jeep.WebP"
                  alt="Jeep"
                  fill
                  className="object-cover rounded"
                />
              </div>
            </div>

            <div className="bg-[#1f1610] text-[#fcfaf7] p-8 rounded-xl">
              <h3 className="font-bold mb-2 text-[#d4af37]">
                24/7 Global Concierge
              </h3>
              <p className="text-sm">
                Regardless of the time zone or the remoteness of your camp, our
                support team is a direct call away.
              </p>
            </div>
          </div>
        </section>

        {/* OFFICE/CONTACT SECTION */}
        <section className="max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif mb-8 text-[#5c3e1c]">
              Start Your Story Today
            </h2>
            <div className="space-y-4 text-sm">
              <p>
                <strong>Headquarters:</strong> Westlands Commercial Centre,
                Nairobi, Kenya
              </p>
              <p>
                <strong>Direct Line:</strong> +254 718 108 358
              </p>
            </div>
          </div>
          <div className="relative h-[300px]">
            <Image
              src="/images/City.WebP"
              alt="Nairobi Office"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutUs;
