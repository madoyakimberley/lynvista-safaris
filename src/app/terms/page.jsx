import React from "react";
import { Scale, ChevronRight, ShieldCheck, AlertTriangle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#FCF9F5] text-[#2C2520] font-sans selection:bg-[#8C6D4F] selection:text-white">
      {/* Hero Banner Section (Centered Layout per screenshot) */}
      <div
        className="relative h-[400px] w-full bg-cover bg-center flex items-center justify-center text-center"
        style={{ backgroundImage: `url('/images/Terms.WebP')` }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 w-full text-white flex flex-col items-center">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-[#EADCC9] mb-4">
            Legal Framework
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
            Terms of Service
          </h1>
          {/* Gold Accent Line */}
          <div className="w-16 h-1 bg-[#C49B47] mt-6 rounded-full"></div>
        </div>
      </div>

      {/* Main Content Layout Container */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="sticky top-8 space-y-8">
            {/* Table of Contents Nav */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#8C6D4F] mb-4">
                Table of Contents
              </p>
              <nav className="space-y-4 text-sm font-medium text-[#6E6259]">
                <a
                  href="#intro"
                  className="block hover:text-[#8C6D4F] transition-colors border-l-2 border-transparent pl-3 focus:border-[#8C6D4F] focus:text-[#8C6D4F]"
                >
                  1. Introduction
                </a>
                <a
                  href="#booking"
                  className="block hover:text-[#8C6D4F] transition-colors border-l-2 border-transparent pl-3 focus:border-[#8C6D4F] focus:text-[#8C6D4F]"
                >
                  2. Booking Terms
                </a>
                <a
                  href="#liability"
                  className="block hover:text-[#8C6D4F] transition-colors border-l-2 border-transparent pl-3 focus:border-[#8C6D4F] focus:text-[#8C6D4F]"
                >
                  3. Liability & Insurance
                </a>
                <a
                  href="#conduct"
                  className="block hover:text-[#8C6D4F] transition-colors border-l-2 border-transparent pl-3 focus:border-[#8C6D4F] focus:text-[#8C6D4F]"
                >
                  4. Code of Conduct
                </a>
                <a
                  href="#intellectual"
                  className="block hover:text-[#8C6D4F] transition-colors border-l-2 border-transparent pl-3 focus:border-[#8C6D4F] focus:text-[#8C6D4F]"
                >
                  5. Intellectual Property
                </a>
                <a
                  href="#governing"
                  className="block hover:text-[#8C6D4F] transition-colors border-l-2 border-transparent pl-3 focus:border-[#8C6D4F] focus:text-[#8C6D4F]"
                >
                  6. Governing Law
                </a>
              </nav>
            </div>

            {/* Need Clarity Card Box */}
            <div className="bg-[#FAF4EC] p-6 rounded-lg border border-[#EADCC9]">
              <Scale className="w-6 h-6 text-[#8C6D4F] mb-3 stroke-[1.5]" />
              <h3 className="font-serif text-lg font-bold text-[#4A3E3D] mb-2">
                Need Clarity?
              </h3>
              <p className="text-xs text-[#6E6259] leading-relaxed mb-4">
                Our support team is available for any questions regarding our
                safari agreements.
              </p>
              <a
                href="mailto:support@lynvistasafaris.com"
                className="text-xs font-bold text-[#8C6D4F] hover:text-[#52341A] transition-colors flex items-center group"
              >
                Contact Support Counsel
                <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </aside>

        {/* Right Main Content Block */}
        <main className="lg:col-span-3 space-y-16 scroll-smooth">
          {/* Section 1: Introduction */}
          <section id="intro" className="space-y-4 scroll-mt-8">
            <h2 className="text-3xl font-serif font-bold text-[#8C6D4F]">
              1. Introduction
            </h2>
            <div className="space-y-4 text-sm text-[#5C534C] leading-relaxed">
              <p>
                Welcome to Lynvista Safaris. These Terms of Service
                (&quot;Terms&quot;) constitute a legally binding agreement
                between you and Lynvista Safaris Ltd regarding your use of our
                website and the travel services we provide. By accessing our
                services, you acknowledge that you have read, understood, and
                agreed to be bound by these Terms.
              </p>
              <p>
                Our commitment to excellence ensures that every safari
                experience is crafted with precision. In return, we expect our
                guests to adhere to the standards outlined herein to ensure
                safety, sustainability, and mutual respect.
              </p>
            </div>
          </section>

          {/* Section 2: Booking Terms */}
          <section id="booking" className="space-y-6 scroll-mt-8">
            <h2 className="text-3xl font-serif font-bold text-[#8C6D4F]">
              2. Booking Terms
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-[#EADCC9] shadow-sm">
                <h4 className="font-serif font-bold text-[#4A3E3D] text-lg mb-3">
                  Deposit & Payment
                </h4>
                <p className="text-sm text-[#6E6259] leading-relaxed">
                  To secure your tailored itinerary, a non-refundable deposit of
                  30% is required at the time of booking. The final balance is
                  due no later than 60 days prior to your arrival in Kenya.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#EADCC9] shadow-sm">
                <h4 className="font-serif font-bold text-[#4A3E3D] text-lg mb-3">
                  Cancellation Policy
                </h4>
                <p className="text-sm text-[#6E6259] leading-relaxed">
                  Cancellations 60+ days prior to travel: forfeit the deposit.
                  59 to 45 days: 50% of the total tour costs are forfeited.
                  Within 45 days: 100% is non-refundable.
                </p>
              </div>
            </div>

            {/* Note Callout */}
            <div className="bg-[#FDF8E7] border-l-4 border-[#C49B47] p-5 rounded-r-lg">
              <p className="text-xs text-[#5C534C] font-medium leading-relaxed">
                Note: Specialized accommodations or peak season bookings may
                have stricter cancellation terms which will be detailed in your
                specific quote.
              </p>
            </div>
          </section>

          {/* Section 3: Liability & Insurance */}
          <section id="liability" className="space-y-4 scroll-mt-8">
            <h2 className="text-3xl font-serif font-bold text-[#8C6D4F]">
              3. Liability & Insurance
            </h2>
            <p className="text-sm text-[#5C534C] leading-relaxed">
              While we prioritize your safety above all else, safari travel
              involves inherent risks, including interaction with wild animals
              and travel through remote terrain. Lynvista Safaris acts as an
              intermediary for lodges and transport providers.
            </p>
            <ul className="space-y-4 pt-2">
              <li className="flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#8C6D4F] shrink-0 stroke-[1.5] mt-0.5" />
                <p className="text-[#5C534C] text-sm leading-relaxed">
                  <strong className="text-[#4A3E3D] font-semibold">
                    Mandatory Insurance:
                  </strong>{" "}
                  All guests are required to maintain comprehensive travel
                  insurance covering medical emergencies, evacuation, and trip
                  cancellation.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-[#8C6D4F] shrink-0 stroke-[1.5] mt-0.5" />
                <p className="text-[#5C534C] text-sm leading-relaxed">
                  <strong className="text-[#4A3E3D] font-semibold">
                    Assumption of Risk:
                  </strong>{" "}
                  Participation in any activity, including game drives and
                  walking safaris, is at the guest&apos;s own risk.
                </p>
              </li>
            </ul>
          </section>

          {/* Section 4: Code of Conduct */}
          <section id="conduct" className="space-y-6 scroll-mt-8">
            <h2 className="text-3xl font-serif font-bold text-[#8C6D4F]">
              4. Code of Conduct
            </h2>

            {/* Feature Image */}
            <img
              src="/images/Conduct.WebP"
              alt="Elephant in the Savannah"
              className="w-full h-64 md:h-[340px] object-cover rounded-2xl shadow-sm"
            />

            <p className="text-sm text-[#5C534C] leading-relaxed">
              We champion &quot;Quiet Luxury&quot;—a philosophy of observing
              nature without disrupting it. Guests agree to:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#FAF4EC] p-5 rounded-xl border border-[#EADCC9]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D4F] mb-2">
                  Wildlife First
                </h4>
                <p className="text-xs text-[#6E6259] leading-relaxed">
                  Never feed or attract wild animals. Maintain prescribed
                  distances.
                </p>
              </div>
              <div className="bg-[#FAF4EC] p-5 rounded-xl border border-[#EADCC9]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D4F] mb-2">
                  Community Respect
                </h4>
                <p className="text-xs text-[#6E6259] leading-relaxed">
                  Ask permission before taking photos of local people or
                  villages.
                </p>
              </div>
              <div className="bg-[#FAF4EC] p-5 rounded-xl border border-[#EADCC9]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6D4F] mb-2">
                  Conservation
                </h4>
                <p className="text-xs text-[#6E6259] leading-relaxed">
                  Strict no-littering policy in all national parks and
                  conservancies.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Intellectual Property */}
          <section id="intellectual" className="space-y-4 scroll-mt-8">
            <h2 className="text-3xl font-serif font-bold text-[#8C6D4F]">
              5. Intellectual Property
            </h2>
            <p className="text-sm text-[#5C534C] leading-relaxed">
              The &quot;Lynvista Safaris&quot; name, logo, and all original
              photography seen on this website and in itineraries are the
              exclusive intellectual property of Lynvista Safaris. Unauthorized
              reproduction or commercial use of our cinematic assets is strictly
              prohibited.
            </p>
          </section>

          {/* Section 6: Governing Law Box */}
          <section id="governing" className="scroll-mt-8">
            <h2 className="text-3xl font-serif font-bold text-[#8C6D4F] mb-4">
              6. Governing Law
            </h2>
            <div className="bg-[#1C140E] text-white p-8 md:p-10 rounded-2xl shadow-xl space-y-4">
              <p className="text-sm text-[#D1C4B4] leading-relaxed font-medium">
                These Terms shall be governed by and construed in accordance
                with the laws of the Republic of Kenya.
              </p>
              <p className="text-sm text-[#A89A8B] leading-relaxed">
                Any disputes arising under or in connection with these Terms
                shall be subject to the exclusive jurisdiction of the courts of
                Nairobi, Kenya.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
