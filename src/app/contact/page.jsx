"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle } from "lucide-react";
import AOSWrapper from "../_components/wrappers/AOSWrapper";
import Image from "next/image";
import Skeleton from "../_components/Skeleton/page";

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-(--color-light) relative">
      {/* 1. FULL PAGE SKELETON (Visible until image loads) */}
      {!isLoaded && (
        <div className="absolute inset-0 z-50 bg-white">
          <Skeleton />
        </div>
      )}

      {/* 2. THE ACTUAL CONTENT */}
      {/* We keep the height consistent so the footer doesn't jump */}
      <div
        className={`transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        {/* Hero Section */}
        <div className="relative h-125 flex flex-col items-center justify-center text-center px-6 overflow-hidden">
          {/* Optimized Image */}
          <Image
            src="/images/contact.webp" // convert your JPG to WebP for speed
            alt="Contact Hero"
            fill
            className="object-cover"
            onLoadingComplete={() => setIsLoaded(true)}
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          <AOSWrapper animation="zoom-out" duration={1200}>
            <h1
              className="relative text-5xl md:text-6xl font-black tracking-tight text-(--color-text-gold) mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              We're Here to Help
            </h1>
            <p className="relative text-lg md:text-xl text-white/90 max-w-xl">
              Whether you have questions, need guidance, or want to book a
              safari, reach out directly via phone, email, or WhatsApp.
            </p>
          </AOSWrapper>
        </div>

        {/* Contact Options */}
        <div className="max-w-5xl mx-auto px-6 -mt-32 pb-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Call Us */}
            <AOSWrapper animation="fade-up" delay={0} duration={800}>
              <div className="bg-white p-10 rounded-2xl flex flex-col items-center text-center shadow-lg hover:-translate-y-3 hover:shadow-2xl transition-transform duration-500 cursor-pointer">
                <Phone
                  size={40}
                  className="text-(--color-secondary-orange) mb-4 stroke-1"
                />
                <h3 className="text-xl font-semibold text-(--color-dark) mb-2">
                  Call Us
                </h3>
                <p className="text-md text-(--color-dark-muted) mb-4">
                  +254793696522 / +254 718108358
                </p>
                <a
                  href="tel:+254793696522"
                  className="text-md font-bold text-(--color-secondary-orange) hover:underline"
                >
                  Call Now
                </a>
                <a
                  href="tel:+254 718108358"
                  className="text-md font-bold text-(--color-secondary-orange) hover:underline"
                >
                  or Call
                </a>
              </div>
            </AOSWrapper>

            {/* Email Us */}
            <AOSWrapper animation="fade-up" delay={150} duration={800}>
              <div className="bg-white p-10 rounded-2xl flex flex-col items-center text-center shadow-lg hover:-translate-y-3 hover:shadow-2xl transition-transform duration-500 cursor-pointer">
                <Mail
                  size={40}
                  className="text-(--color-secondary-orange) mb-4 stroke-1"
                />
                <h3 className="text-xl font-semibold text-(--color-dark) mb-2">
                  Email Us
                </h3>
                <p className="text-md text-(--color-dark-muted) mb-4">
                  lynvistasafaris@outlook.com
                </p>
                <a
                  href="mailto:lynvistasafaris@outlook.com"
                  className="text-md font-bold text-(--color-secondary-orange) hover:underline"
                >
                  Send Email
                </a>
              </div>
            </AOSWrapper>

            {/* WhatsApp */}
            <AOSWrapper animation="fade-up" delay={300} duration={800}>
              <div className="bg-white p-10 rounded-2xl flex flex-col items-center text-center shadow-lg hover:-translate-y-3 hover:shadow-2xl transition-transform duration-500 cursor-pointer">
                <MessageCircle
                  size={40}
                  className="text-(--color-secondary-orange) mb-4 stroke-1"
                />
                <h3 className="text-xl font-semibold text-(--color-dark) mb-2">
                  WhatsApp
                </h3>
                <p className="text-md text-(--color-dark-muted) mb-4">
                  Chat with us instantly
                </p>
                <a
                  href="https://wa.me/254793696522"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-md font-bold text-(--color-secondary-orange) hover:underline"
                >
                  Chat Now
                </a>
              </div>
            </AOSWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
