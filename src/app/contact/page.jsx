"use client";

import { Phone, Mail, MessageCircle } from "lucide-react";
import AOSWrapper from "../_components/wrappers/AOSWrapper";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-(--color-light)">
      {/* Hero Section */}
      <div
        className="relative h-125 flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('/images/contact.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <AOSWrapper animation="zoom-out" duration={1200}>
          <h1
            className="text-5xl md:text-6xl font-black tracking-tight text-(--color-text-gold) mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            We're Here to Help
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl">
            Whether you have questions, need guidance, or want to book a safari,
            reach out directly via phone, email, or WhatsApp.
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
                +254 700 000 000
              </p>
              <a
                href="tel:+254700000000"
                className="text-md font-bold text-(--color-secondary-orange) hover:underline"
              >
                Call Now
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
                info@lynvistasafaris.com
              </p>
              <a
                href="mailto:info@lynvistasafaris.com"
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
                href="https://wa.me/254700000000"
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
  );
}
