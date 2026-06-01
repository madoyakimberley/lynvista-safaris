"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

function MainNav() {
  const [open, setOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 80) {
        setShowHeader(false);
        setOpen(false);
      } else {
        setShowHeader(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Book a Tour", href: "/book" },
    { label: "Our Services", href: "/services" },
    { label: "Destinations", href: "/destinations" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`           bg-[#2d1b0b] text-[#faf8f3] px-4 md:px-12 py-3 shadow-lg
          sticky top-0 z-[60] transition-transform duration-300
          ${showHeader ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {" "}
        <div className="container mx-auto flex justify-between items-center">
          {" "}
          <div className="flex items-center z-10 w-1/3">
            <button
              className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setOpen(true)}
              aria-label="Toggle Menu"
            >
              {" "}
              <Menu size={28} />{" "}
            </button>{" "}
          </div>
          <div className="flex flex-col items-center justify-center w-1/3">
            <div className="flex flex-col items-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl xl:text-4xl tracking-tight leading-none whitespace-nowrap font-heading font-bold text-center">
                <span className="text-white">LYNVISTA</span>{" "}
                <span className="text-[#fbbf24]">SAFARIS</span>
              </h1>

              <span className="text-[8px] md:text-[10px] tracking-[0.4em] uppercase text-white font-semibold mt-1">
                LIMITED
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end z-10 w-1/3">
            <a
              href="/"
              className="h-12 w-12 md:h-16 md:w-16 flex items-center justify-center overflow-hidden hover:scale-110 transition-transform"
            >
              <Image
                src="/images/logo.WebP"
                alt="Lynvista Logo"
                width={64}
                height={64}
                priority
                className="object-contain"
                style={{ width: "auto", height: "auto" }} // Next.js specifically looks for this prop!
              />
            </a>
          </div>
        </div>
      </header>

      {/* FULL SCREEN OVERLAY MENU */}
      <div
        className={`fixed inset-0 z-[100] flex flex-col md:flex-row transition-opacity duration-500 ease-in-out ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* IMAGE SECTION */}
        <div className="relative w-full md:w-1/2 h-[35vh] md:h-full overflow-hidden">
          <Image
            src="/images/NavBar.WebP"
            alt="Lynvista Safaris"
            fill
            // Fix: 100vw on mobile, 50vw on medium screens (768px) and up
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 text-white">
            <h2 className="text-2xl md:text-4xl font-bold font-heading">
              LYNVISTA SAFARIS
            </h2>

            <p className="text-xs md:text-sm tracking-widest uppercase mt-2">
              TAILORED LUXURY EXPERIENCES
            </p>
          </div>
        </div>

        {/* MENU SECTION */}
        <div className="w-full md:w-1/2 flex-1 md:h-full bg-[#1a1614] p-8 md:p-20 flex flex-col justify-between text-white relative overflow-y-auto">
          <button
            className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close Menu"
          >
            <X size={32} />
          </button>

          <div className="flex flex-col justify-center flex-grow space-y-8">
            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                className="group flex items-center space-x-6 text-4xl md:text-5xl font-serif font-medium hover:text-[#fbbf24] transition-all"
                onClick={() => setOpen(false)}
              >
                <span className="text-sm text-[#fbbf24] font-mono opacity-60">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{link.label}</span>
              </a>
            ))}
          </div>

          <div className="mt-auto pt-10 flex flex-col gap-6">
            <p className="text-[10px] text-gray-600">
              © {currentYear} Lynvista Safari. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainNav;
