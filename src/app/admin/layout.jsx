"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  Package,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
   
    { name: "Payments", href: "/admin/payments", icon: DollarSign },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`relative flex flex-col transition-all duration-300 border-r shrink-0 z-20
        ${sidebarOpen ? "w-64 p-6" : "w-20 p-4"}`}
        style={{
          background: "var(--color-dark)",
          borderColor: "rgba(255,255,255,0.06)",
          color: "white",
        }}
      >
        {/* LOGO */}
        <div className="mb-10 h-12 flex items-center">
          {sidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <h2
                className="text-2xl font-heading font-bold"
                style={{ color: "var(--color-text-gold)" }}
              >
                Lynvista
              </h2>
              <p className="text-[10px] tracking-[0.3em] uppercase opacity-60">
                Admin Portal
              </p>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-all duration-200
                ${isActive ? "font-medium" : "opacity-80 hover:opacity-100"}`}
                style={{
                  background: isActive
                    ? "var(--color-secondary)"
                    : "transparent",
                  color: isActive ? "black" : "white",
                }}
              >
                <Icon size={18} className="shrink-0" />

                {sidebarOpen && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* BACK TO SITE */}
        <div className="mt-auto pt-10 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-3 text-sm opacity-80 hover:opacity-100 transition whitespace-nowrap"
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && "Back to site"}
          </Link>
        </div>

        {/* TOGGLE BUTTON */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-12 rounded-full p-1 shadow-md z-30"
          style={{
            background: "var(--color-secondary)",
            color: "black",
          }}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
        style={{ background: "var(--color-light)" }}
      >
        {/* HEADER */}
        <header
          className="h-16 flex items-center justify-between px-8 border-b sticky top-0 z-10 shrink-0"
          style={{
            borderColor: "#e7e3da",
            background: "white",
          }}
        >
          <span
            className="text-sm font-medium capitalize"
            style={{ color: "var(--color-dark-muted)" }}
          >
            Admin Dashboard{" "}
            {pathname !== "/admin" && ` / ${pathname.split("/").pop()}`}
          </span>

          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "var(--color-primary-green)",
              color: "white",
            }}
          >
            AD
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <main className="flex-1 p-8 lg:p-12">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>

          {/* FOOTER */}
          <footer
            className="py-6 text-xs text-center border-t mt-auto"
            style={{
              borderColor: "#e7e3da",
              color: "var(--color-dark-muted)",
              background: "white",
            }}
          >
            © {new Date().getFullYear()} Lynvista Safaris Limited
          </footer>
        </div>
      </div>
    </div>
  );
}
