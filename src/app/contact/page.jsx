"use client";

import { useState, Suspense } from "react";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Skeleton from "./Skeleton";

function ContactPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "Safari Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setStatusMessage({
          type: "success",
          text: "Inquiry successfully sent! Check your email.",
        });
        setFormData({
          full_name: "",
          email: "",
          subject: "Safari Inquiry",
          message: "",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: data.message || "Something went wrong.",
        });
      }
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: "Failed to communicate with server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F4] min-h-screen text-[#3A2E26] font-sans selection:bg-[#c19b6c] selection:text-white overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <div className="relative h-[500px] w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/contact.WebP"
            alt="Contact Page Odyssey Background"
            fill
            priority
            className="object-cover brightness-[0.45]"
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-wide mb-4 leading-tight">
            Let's Plan Your Odyssey
          </h1>
          <p className="text-base md:text-lg text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Our travel experts are ready to craft your bespoke African
            experience. Reach out and begin your journey into the wild.
          </p>
        </div>
      </div>

      {/* 2. DIRECT ACCESS & INTERACTIVE FORM SPLIT */}
      <div
        className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
        suppressHydrationWarning
      >
        <div className="lg:col-span-5 space-y-8">
          <div>
            <p className="uppercase tracking-[0.25em] text-[10px] font-bold text-[#a48665] mb-2">
              Direct Access
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#4a3219] leading-tight">
              Expert Guidance is a Message Away
            </h2>
          </div>

          <div className="space-y-4">
            <a
              href="tel:+254793696522"
              className="flex items-start gap-5 bg-[#fcfbfa] border border-[#3A2E26]/5 p-6 rounded-xl hover:shadow-md transition-shadow group"
            >
              <div className="p-3 bg-[#FAF9F4] rounded-lg text-[#4a3219] group-hover:bg-[#e9bc47]/10 transition-colors">
                <Phone size={20} className="stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#a48665] mb-1">
                  Call Us
                </h4>
                <p className="text-sm font-bold tracking-wide text-[#3A2E26]">
                  +254 793 696 522
                </p>
                <p className="text-sm font-bold tracking-wide text-[#3A2E26]">
                  +254 718 108 358
                </p>
              </div>
            </a>

            <a
              href="mailto:lynvistasafaris@outlook.com"
              className="flex items-start gap-5 bg-[#fcfbfa] border border-[#3A2E26]/5 p-6 rounded-xl hover:shadow-md transition-shadow group"
            >
              <div className="p-3 bg-[#FAF9F4] rounded-lg text-[#4a3219] group-hover:bg-[#e9bc47]/10 transition-colors">
                <Mail size={20} className="stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#a48665] mb-1">
                  Email Us
                </h4>
                <p className="text-sm font-bold text-[#3A2E26] break-all">
                  lynvistasafaris@outlook.com
                </p>
              </div>
            </a>

            <a
              href="https://wa.me/254793696522"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-5 bg-[#fcfbfa] border border-[#3A2E26]/5 p-6 rounded-xl hover:shadow-md transition-shadow group"
            >
              <div className="p-3 bg-[#FAF9F4] rounded-lg text-[#4a3219] group-hover:bg-[#e9bc47]/10 transition-colors">
                <MessageCircle size={20} className="stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#a48665] mb-1">
                  WhatsApp
                </h4>
                <p className="text-sm font-medium text-[#64564b]">
                  Chat with an Expert Now
                </p>
              </div>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100/50">
          <h3 className="text-2xl font-serif font-bold text-[#4a3219] mb-8">
            Send a Quick Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a48665] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  data-lpignore="true"
                  placeholder="John Doe"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full bg-[#FAF9F4] border border-[#3A2E26]/10 rounded-lg p-3.5 text-sm font-medium text-[#3A2E26] placeholder:text-gray-400 focus:outline-none focus:border-[#4a3219] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a48665] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-[#FAF9F4] border border-[#3A2E26]/10 rounded-lg p-3.5 text-sm font-medium text-[#3A2E26] placeholder:text-gray-400 focus:outline-none focus:border-[#4a3219] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a48665] mb-2">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full bg-[#FAF9F4] border border-[#3A2E26]/10 rounded-lg p-3.5 text-sm font-medium text-[#3A2E26] focus:outline-none focus:border-[#4a3219] transition-colors appearance-none cursor-pointer"
              >
                <option value="Safari Inquiry">Safari Inquiry</option>
                <option value="Tailored Luxury Itinerary">
                  Tailored Luxury Itinerary
                </option>
                <option value="Corporate & Group Travel">
                  Corporate & Group Travel
                </option>
                <option value="General Question">General Question</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#a48665] mb-2">
                Your Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tell us about your dream safari..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full bg-[#FAF9F4] border border-[#3A2E26]/10 rounded-lg p-3.5 text-sm font-medium text-[#3A2E26] placeholder:text-gray-400 focus:outline-none focus:border-[#4a3219] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#5c4021] hover:bg-[#4a3219] disabled:bg-gray-400 text-white font-bold uppercase text-xs tracking-widest py-4 px-6 rounded-lg shadow-md transition-all flex items-center justify-center gap-3 group"
            >
              <span>{isSubmitting ? "Sending..." : "Send Inquiry"}</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            {statusMessage.text && (
              <p
                className={`text-center text-xs font-bold uppercase tracking-wider mt-4 ${
                  statusMessage.type === "success"
                    ? "text-emerald-700"
                    : "text-rose-700"
                }`}
              >
                {statusMessage.text}
              </p>
            )}
          </form>
        </div>
      </div>

      <section className="bg-[#12110e] text-white py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <p className="uppercase tracking-[0.25em] text-[10px] font-bold text-[#e9bc47] mb-2">
                Visit Our Hub
              </p>
              <h2 className="text-4xl font-serif font-bold tracking-wide">
                Our Heart in Nairobi
              </h2>
              <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed max-w-xl font-medium">
                Located in the vibrant Westlands district, our doors are always
                open for travelers seeking a personalized touch to their African
                adventure.
              </p>
            </div>
            <div className="space-y-6 border-t border-white/10 pt-8">
              <div className="flex gap-4 items-start">
                <MapPin size={18} className="text-[#e9bc47] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">
                    Westlands Commercial Centre
                  </p>
                  <p className="text-xs text-white/60 mt-0.5">
                    Old Block, 1st Floor
                  </p>
                  <p className="text-xs text-white/60">Nairobi, Kenya</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Clock size={18} className="text-[#e9bc47] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-white">Office Hours</p>
                  <p className="text-xs text-white/60 mt-0.5">
                    Mon – Fri: 08:00 AM – 05:00 PM
                  </p>
                  <p className="text-xs text-white/60">
                    Saturday: 09:00 AM – 01:00 PM
                  </p>
                </div>
              </div>
            </div>
            <a
              href="https://google.com/maps/place/?q=place_id:ChIJL_ZOJT8XLxgRP-62QIdhFes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-white/20 hover:border-white px-6 py-3 text-xs uppercase tracking-widest font-bold rounded transition-colors"
            >
              <span>Get Directions</span>
              <span>↗</span>
            </a>
          </div>
          <div className="relative h-[420px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/office.WebP"
              alt="Lynvista Safaris Commercial Hub Building"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/90">
                Location: Nairobi Business District
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FAF9F4] py-20 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-10 md:p-16 text-center shadow-lg border border-gray-100">
          <h2 className="text-3xl font-serif font-bold text-[#4a3219] mb-3">
            Your African Story Starts Here
          </h2>
          <p className="text-sm text-[#64564b] max-w-xl mx-auto leading-relaxed mb-8 font-medium">
            Whether it's the Great Migration or a secluded beach walk, we handle
            the details so you can experience the wonder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/book"
              className="px-8 py-3.5 bg-[#5c4021] text-white font-bold uppercase text-xs tracking-widest rounded shadow-md hover:bg-[#4a3219] transition-colors w-full sm:w-auto"
            >
              Start Your Custom Itinerary
            </a>
            <a
              href="tel:+254718108358"
              className="px-8 py-3.5 border border-[#4a3219] text-[#4a3219] font-bold uppercase text-xs tracking-widest rounded hover:bg-[#4a3219] hover:text-white transition-all w-full sm:w-auto"
            >
              Talk to a Safari Specialist
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <ContactPage />
    </Suspense>
  );
}
