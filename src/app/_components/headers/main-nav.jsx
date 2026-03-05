"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

function MainNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Destinations", href: "/destinations" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-[#2d1b0b] text-[#faf8f3] px-4 md:px-12 py-3 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* LEFT */}
        <div className="flex items-center z-10">
          <button
            className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>

          <nav className="hidden lg:flex items-center gap-6 font-medium text-sm tracking-wide">
            {navLinks.map((link, index) => (
              <div key={link.href} className="flex items-center gap-6">
                <a
                  href={link.href}
                  className="
                    uppercase
                    relative
                    hover:text-[#fbbf24]
                    transition-colors
                    after:content-['']
                    after:absolute
                    after:left-0
                    after:-bottom-1
                    after:h-0.5
                    after:w-0
                    after:bg-[#fbbf24]
                    after:transition-all
                    hover:after:w-full
                  "
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
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="pointer-events-auto flex flex-col items-center">
            <h1
              className="text-2xl md:text-4xl tracking-tight leading-none whitespace-nowrap"
              style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
            >
              <span className="text-white">LYNVISTA</span>{" "}
              <span className="text-[#fbbf24]">SAFARIS</span>
            </h1>

            <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-white font-semibold mt-1">
              LIMITED
            </span>
          </div>
        </div>

        {/* RIGHT - Logo */}
        <div className="flex items-center gap-4 z-10">
          <a
            href="/"
            className="h-16 w-16 md:h-20 md:w-20 flex items-center justify-center overflow-hidden hover:scale-110 transition-transform"
            aria-label="Go to homepage"
          >
            <img
              src="/images/logo.png"
              alt="Lynvista Logo"
              className="h-full w-full object-contain"
            />
          </a>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`
          lg:hidden
          absolute left-0 right-0 top-full
          bg-[#2d1b0b]
          transition-all duration-500 ease-in-out
          rounded-b-3xl
          shadow-2xl
          border-t border-white/5
          ${open ? "max-h-96 opacity-100 py-4 px-6" : "max-h-0 opacity-0 pointer-events-none"}
        `}
      >
        <div className="flex flex-col">
          {navLinks.map((link, index) => (
            <div key={link.label} className="w-full">
              <a
                href={link.href}
                className="
                  text-lg 
                  font-medium 
                  py-5 
                  text-gray-200
                  hover:text-[#fbbf24] 
                  transition-all
                  flex 
                  items-center
                "
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>

              {index !== navLinks.length - 1 && (
                <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

export default MainNav;
