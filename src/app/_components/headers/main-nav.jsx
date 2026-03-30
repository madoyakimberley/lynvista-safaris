"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

function MainNav() {
  const [open, setOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

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
    { label: "Services", href: "/services" },
    { label: "Destinations", href: "/destinations" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`
        bg-[#2d1b0b] text-[#faf8f3] px-4 md:px-12 py-3 shadow-lg 
        sticky top-0 z-50 transition-transform duration-300
        ${showHeader ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* LEFT */}
        <div className="flex items-center z-10 xl:w-1/3">
          <button
            className="xl:hidden p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>

          <nav className="hidden xl:flex items-center gap-6 font-medium text-sm tracking-wide">
            {navLinks.map((link, index) => (
              <div key={link.href} className="flex items-center gap-6">
                <a
                  href={link.href}
                  className="uppercase relative hover:text-[#fbbf24] transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-[#fbbf24] after:transition-all hover:after:w-full"
                >
                  {link.label}
                </a>
                {index !== navLinks.length - 1 && (
                  <span className="w-px h-5 bg-white/20" />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center justify-center xl:w-1/3">
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

        {/* RIGHT */}
        <div className="flex items-center justify-end z-10 xl:w-1/3">
          <a
            href="/"
            className="h-12 w-12 md:h-16 md:w-16 flex items-center justify-center overflow-hidden hover:scale-110 transition-transform"
          >
            <img
              src="/images/logo.png"
              alt="Lynvista Logo"
              className="h-full w-full object-contain"
            />
          </a>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`xl:hidden absolute left-0 right-0 top-full bg-[#2d1b0b] transition-all duration-500 ease-in-out rounded-b-3xl shadow-2xl border-t border-white/5 ${open ? "max-h-96 opacity-100 py-4 px-6" : "max-h-0 opacity-0 pointer-events-none"}`}
      >
        <div className="flex flex-col">
          {navLinks.map((link, index) => (
            <div key={link.label} className="w-full">
              <a
                href={link.href}
                className="text-lg font-medium py-5 text-gray-200 hover:text-[#fbbf24] transition-all flex items-center"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
              {index !== navLinks.length - 1 && (
                <div className="h-px w-full bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

export default MainNav;
