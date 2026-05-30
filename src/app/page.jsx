"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import BodyWrapper from "./_components/wrappers/BodyWrapper";
import AOSWrapper from "./_components/wrappers/AOSWrapper";
import AOS from "aos";
import "aos/dist/aos.css";

export default function HomePage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real-time data from your TiDB API route
  useEffect(() => {
    async function fetchTours() {
      try {
        const res = await fetch("/api/tours");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setTours(data);
          } else {
            console.error("Expected an array of tours, but got:", data);
            setTours([]);
          }
        } else {
          console.error("Failed to fetch: API returned status", res.status);
        }
      } catch (err) {
        console.error("Failed fetching tours:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTours();
  }, []);

  // Trigger an AOS recalculation for static elements
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        AOS.refresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <AOSWrapper>
      <BodyWrapper>
        {/* HERO SECTION */}
        <section
          className="relative w-full min-h-[90vh] flex items-center justify-center px-6 md:px-16 lg:px-24 py-20"
          style={{
            backgroundColor: "#2d1b0b",
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url('/images/homepage.WebP')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div
            className="max-w-3xl text-center flex flex-col items-center space-y-6"
            data-aos="fade-up"
            data-aos-delay="0"
            data-aos-duration="350"
            data-aos-easing="ease-out"
            data-aos-once="true"
          >
            <span className="text-sm font-bold tracking-widest text-[#e5b035] uppercase bg-black/30 px-3 py-1.5 rounded-md inline-block">
              Welcome to Kenya's Premier Tour Operator
            </span>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Discover Kenya's <br />
              <span className="text-[#e5b035]">Untamed Beauty</span>
            </h1>

            <p className="text-lg md:text-xl text-white/95 max-w-xl font-normal leading-relaxed">
              Unforgettable safaris, pristine white sand beaches, and deep,
              authentic cultural experiences crafted beautifully around your
              desires.
            </p>

            <div className="flex flex-wrap gap-4 pt-4 justify-center">
              <a
                href="/book"
                className="flex items-center justify-center gap-2 py-4 px-8 bg-[#e5b035] text-[#2d1b0b] text-base font-bold rounded-lg shadow-lg hover:bg-[#c99627] transition-all duration-300"
              >
                Plan Your Journey <ArrowRight size={20} />
              </a>
              <a
                href="#featured-safaris"
                className="flex items-center justify-center gap-2 py-4 px-8 border-2 border-white text-white text-base font-bold rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Explore Safaris
              </a>
            </div>
          </div>
        </section>

        {/* WHY US CONTENT GRID SECTION */}
        <section
          id="why-us"
          className="py-24 bg-[#fbf9f6] px-6 md:px-12 lg:px-24"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16" data-aos="fade-down">
              <h2
                className="text-3xl md:text-5xl font-bold text-[#2d1b0b] mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Why Lynvista Safaris Limited?
              </h2>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                We create unforgettable safari adventures, seamless custom
                bookings, and luxury travel experiences tailored precisely to
                you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div
                data-aos="fade-up"
                className="md:col-span-8 bg-[#fefcf7] p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between relative overflow-hidden group min-h-[280px]"
              >
                <div className="absolute right-0 bottom-0 w-1/3 h-full opacity-10 pointer-events-none bg-[url('/images/homepage.WebP')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
                <div className="max-w-lg relative z-10">
                  <div className="w-10 h-10 rounded-full bg-[#fcefe6] flex items-center justify-center text-[#e5b035] font-bold mb-6">
                    🐾
                  </div>
                  <h3 className="text-2xl font-bold text-[#2d1b0b] mb-4">
                    Authentic Safari Experiences
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Explore Kenya’s most iconic wildlife destinations with
                    world-class certified guides, custom-built 4x4 safari
                    cruisers, and highly curated park routes.
                  </p>
                </div>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="md:col-span-4 bg-[#1b3c15] p-8 md:p-12 rounded-2xl shadow-sm flex flex-col justify-between text-white min-h-[280px]"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    Tailored Luxury Travel
                  </h3>
                  <p className="text-emerald-100/80 leading-relaxed text-sm">
                    From absolute coastal beach escapes to beautiful honeymoon
                    bush packages—every single journey is detailed perfectly to
                    your budget.
                  </p>
                </div>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="md:col-span-4 bg-[#f9bf26] p-8 md:p-12 rounded-2xl shadow-sm flex flex-col justify-between text-[#2d1b0b] min-h-[280px]"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    Trusted & 24/7 Support
                  </h3>
                  <p className="text-[#2d1b0b]/80 leading-relaxed text-sm">
                    Our local experts remain completely accessible around the
                    clock to support layout changes, local guidance, or ground
                    updates.
                  </p>
                </div>
              </div>

              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="md:col-span-8 bg-[#2d1b0b] p-8 md:p-12 rounded-2xl shadow-sm text-white flex flex-col justify-between min-h-[280px]"
              >
                <div className="max-w-xl">
                  <h3 className="text-2xl font-bold mb-4">
                    Your Partner in Adventure
                  </h3>
                  <p className="text-stone-300 leading-relaxed mb-6 text-sm">
                    We manage the end-to-end operational details including
                    internal regional flights, park entries, and luxury tented
                    lodge check-ins so you can focus entirely on taking in the
                    wild.
                  </p>
                  <a
                    href="/services"
                    className="inline-block px-6 py-2.5 border border-white/40 rounded-lg text-sm font-semibold hover:bg-white hover:text-[#2d1b0b] transition-all duration-300"
                  >
                    View Our Services
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DYNAMIC FEATURED SAFARIS GRID FROM DB */}
        <section
          id="featured-safaris"
          className="py-24 bg-white px-6 md:px-12 lg:px-24"
        >
          <div className="max-w-6xl mx-auto">
            <div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12"
              data-aos="fade-right"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#b48d28] block mb-2">
                  Our Curated Catalog
                </span>
                <h2
                  className="text-3xl md:text-5xl font-bold text-[#2d1b0b]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Featured Safaris
                </h2>
              </div>
              <a
                href="/destinations"
                className="mt-4 sm:mt-0 flex items-center gap-2 text-[#2d1b0b] font-bold hover:text-[#b48d28] transition-colors group"
              >
                View All Packages{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="animate-pulse bg-gray-100 rounded-2xl h-[450px]"
                  ></div>
                ))}
              </div>
            ) : tours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {tours.slice(0, 2).map((tour) => (
                  <div
                    key={tour.id}
                    // REMOVED data-aos="fade-up" here. This bypasses the opacity bug permanently.
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col group h-full will-change-transform"
                  >
                    <div className="relative h-72 w-full bg-stone-100 overflow-hidden">
                      <Image
                        src={tour.image}
                        alt={tour.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover will-change-transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[#2d1b0b] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm z-10">
                        Best Seller
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-[#2d1b0b] mb-3 group-hover:text-[#b48d28] transition-colors">
                          {tour.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-8 leading-relaxed">
                          {tour.description}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-5 border-t border-gray-100 text-sm text-gray-600 font-medium">
                        <span className="flex items-center gap-2">
                          <Clock size={16} className="text-[#b48d28]" />{" "}
                          {tour.duration || "Custom Days"}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin size={16} className="text-[#b48d28]" />{" "}
                          {tour.location || "Kenya"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-lg">
                  No featured safaris are currently available. Please check back
                  shortly.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SPLIT SCREEN LOWER CTA SIGNUP BANNER */}
        <section
          suppressHydrationWarning
          className="py-12 bg-white px-6 md:px-12 lg:px-24"
        >
          <div className="max-w-7xl mx-auto bg-[#141210] rounded-[2.5rem] overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
            <div
              className="lg:col-span-6 p-8 md:p-16 flex flex-col justify-center space-y-6"
              data-aos="fade-right"
              data-aos-duration="400"
            >
              <h2
                className="text-3xl md:text-5xl font-bold text-white leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Start Your Story <br />
                <span className="text-[#f9bf26]">Today</span>
              </h2>
              <p className="text-stone-400 text-sm md:text-base max-w-md leading-relaxed">
                Ready to craft your bespoke African adventure? Our travel
                experts are standing by to design the perfect itinerary tailored
                to your unique vision.
              </p>

              {/* Updated to a Link button instead of a form */}
              <div className="pt-2">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-[#f9bf26] text-[#2d1b0b] font-bold rounded-xl hover:bg-[#e0ab22] transition-all duration-300 shadow-md text-sm whitespace-nowrap"
                >
                  Speak to a Specialist
                </a>
              </div>
            </div>

            <div
              className="lg:col-span-6 min-h-[300px] lg:min-h-full bg-cover bg-center relative"
              style={{
                backgroundImage: "url('/images/homepage.WebP')",
              }}
              data-aos="fade-left"
              data-aos-duration="400"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#141210] via-transparent to-transparent lg:block hidden"></div>
            </div>
          </div>
        </section>
      </BodyWrapper>
    </AOSWrapper>
  );
}
