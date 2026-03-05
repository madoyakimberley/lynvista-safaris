"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function MainNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#2d1b0b] px-4 py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo from public/images/logo.png */}
        <div className="bg-white p-1 rounded-sm">
          <img
            src="/images/logo.png"
            alt="Lynvista Safaris Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 font-medium text-white">
          <a href="/" className="hover:text-[#fbc02d] transition-colors">
            Home
          </a>
          <a
            href="/services"
            className="hover:text-[#fbc02d] transition-colors"
          >
            Services
          </a>
          <a href="/contact" className="hover:text-[#fbc02d] transition-colors">
            Contact
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button className="text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden flex flex-col gap-4 mt-4 pb-4 text-white border-t border-white/10 pt-4">
          <a href="/" className="px-2">
            Home
          </a>
          <a href="/services" className="px-2">
            Services
          </a>
          <a href="/contact" className="px-2">
            Contact
          </a>
        </div>
      )}
    </header>
  );
}
