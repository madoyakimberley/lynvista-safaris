"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function WhatsAppButton() {
  const phoneNumber = "254793696522";
  const message = "Hello Lynvista Safaris! I'd like to inquire about a trip.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-6 left-6 z-50
        bg-(--color-primary)
        text-white
        w-16 h-16
        rounded-full
        shadow-[0_10px_30px_rgba(45,80,22,0.5)]
        flex items-center justify-center
        transition-all duration-300
        hover:scale-110
        hover:bg-(--color-primary-light)
        group
      "
      aria-label="Contact on WhatsApp"
    >
      {/* Glow Effect */}
      <span
        className="
        absolute inset-0 rounded-full
        bg-(--color-primary-light)
        animate-ping
        opacity-20
      "
      ></span>

      {/* WhatsApp Icon */}
      <FontAwesomeIcon
        icon={faWhatsapp}
        className="relative z-10 text-3xl group-hover:rotate-12 transition-transform"
      />

      {/* Tooltip */}
      <span
        className="
        absolute left-20
        bg-(--color-dark)
        text-(--color-text-gold)
        text-sm
        py-1 px-4
        rounded-full
        opacity-0
        group-hover:opacity-100
        transition-opacity
        whitespace-nowrap
        pointer-events-none
        border border-(--color-text-gold)/20
      "
      >
        Chat with us
      </span>
    </a>
  );
}
