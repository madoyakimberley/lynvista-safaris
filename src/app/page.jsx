"use client";

import { ArrowRight } from "lucide-react";

/* Components */
import MainNav from "./_components/headers/main-nav";
import MainFooter from "./_components/footers/main-footer";
import BodyWrapper from "./_components/wrappers/BodyWrapper";
import AOSWrapper from "./_components/wrappers/AOSWrapper";

export default function HomePage() {
  return (
    <AOSWrapper>
      <BodyWrapper>
        <section
          className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url('/images/homepage.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="max-w-md mx-auto space-y-8" data-aos="fade-up">
            <h1
              className="text-6xl md:text-7xl font-black leading-tight tracking-tight text-(--color-text-gold)"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 900 }}
            >
              DISCOVER <br /> KENYA
            </h1>

            <div className="space-y-4" data-aos="fade-up" data-aos-delay="200">
              <h2 className="text-2xl md:text-3xl font-medium text-white leading-snug">
                Welcome to an incredible experience
              </h2>
              <p className="text-lg md:text-xl text-white/90 font-normal leading-relaxed">
                Unforgettable safaris, pristine beaches, and authentic cultural
                experiences
              </p>
            </div>

            <div
              className="flex flex-col gap-5 w-full max-w-xs mx-auto pt-4"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <a
                href="/destinations"
                className="flex items-center justify-center gap-2 py-5 px-8 bg-(--color-primary-green) text-white text-xl font-bold rounded-[40px] shadow-lg hover:scale-105 transition-all"
              >
                Explore Safari <ArrowRight size={24} />
              </a>

              <a
                href="/book"
                className="py-5 px-8 bg-(--color-secondary-orange) text-white text-xl font-bold rounded-[40px] shadow-lg hover:scale-105 transition-all"
              >
                Plan Your Journey
              </a>
            </div>
          </div>
        </section>

        <section className="py-28 bg-(--color-light) px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-20" data-aos="fade-down">
              <h2
                className="text-4xl md:text-6xl font-black text-(--color-dark) mb-6"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Why Lynvista Safaris Limited ?
              </h2>

              <p className="text-lg md:text-xl text-(--color-dark-muted) max-w-3xl mx-auto">
                We create unforgettable safari adventures, seamless bookings,
                and luxury travel experiences tailored just for you.
              </p>

              <div className="w-24 h-1 bg-(--color-secondary-orange) mx-auto mt-6"></div>
            </div>

            {/* Highlight Cards */}
            <div className="grid md:grid-cols-3 gap-10">
              {/* Card 1 */}
              <div
                data-aos="fade-up"
                className="bg-white p-10 rounded-[35px] shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100 hover:-translate-y-2"
              >
                <h3
                  className="text-2xl font-bold text-(--color-dark) mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Authentic Safari Experiences
                </h3>

                <p className="text-lg text-(--color-dark-muted) leading-relaxed">
                  Explore Kenya’s most iconic wildlife destinations with expert
                  guides, premium vehicles, and carefully curated itineraries.
                </p>
              </div>

              {/* Card 2 */}
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="bg-white p-10 rounded-[35px] shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100 hover:-translate-y-2"
              >
                <h3
                  className="text-2xl font-bold text-(--color-dark) mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Tailored Luxury Travel
                </h3>

                <p className="text-lg text-(--color-dark-muted) leading-relaxed">
                  From beach escapes to honeymoon packages — every trip is
                  customized around your budget, comfort, and travel dreams.
                </p>
              </div>

              {/* Card 3 */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="bg-white p-10 rounded-[35px] shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100 hover:-translate-y-2"
              >
                <h3
                  className="text-2xl font-bold text-(--color-dark) mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Trusted & 24/7 Support
                </h3>

                <p className="text-lg text-(--color-dark-muted) leading-relaxed">
                  Our travel experts are available around the clock to assist
                  with bookings, changes, emergencies, and travel guidance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </BodyWrapper>
    </AOSWrapper>
  );
}
