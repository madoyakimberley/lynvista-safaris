import React from "react";
import {
  IdCard,
  Compass,
  CreditCard,
  Phone,
  Check,
  Lock,
  Tent,
  Plane,
  Shield,
  HeartPulse,
  Mail,
} from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FCF9F5] text-[#2C2520] font-sans selection:bg-[#8C6D4F] selection:text-white">
      {/* Hero Banner Section */}
      <div
        className="relative h-[400px] w-full bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url('/images/Privacy.WebP')` }}
      >
        {/* Dark Overlay to maintain high readability */}
        <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-6 w-full text-white">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#EADCC9] mb-3">
            Lynvista Safaris
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-[#F5EFE6] leading-relaxed font-light">
            At Lynvista Safaris, your privacy is as essential as the landscapes
            we explore. We are committed to the meticulous protection of your
            personal data through world-class security standards.
          </p>
        </div>
      </div>

      {/* Main Content Layout Container */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Left Sidebar Navigation */}
        <aside className="lg:col-span-1 space-y-8">
          <nav className="sticky top-8 space-y-4 text-sm font-medium text-[#6E6259]">
            <a
              href="#collect"
              className="block hover:text-[#8C6D4F] transition-colors border-l-2 border-transparent pl-3 focus:border-[#8C6D4F] focus:text-[#8C6D4F]"
            >
              Information We Collect
            </a>
            <a
              href="#use-data"
              className="block hover:text-[#8C6D4F] transition-colors border-l-2 border-transparent pl-3 focus:border-[#8C6D4F] focus:text-[#8C6D4F]"
            >
              How We Use Your Data
            </a>
            <a
              href="#protection"
              className="block hover:text-[#8C6D4F] transition-colors border-l-2 border-transparent pl-3 focus:border-[#8C6D4F] focus:text-[#8C6D4F]"
            >
              Data Protection
            </a>
            <a
              href="#rights"
              className="block hover:text-[#8C6D4F] transition-colors border-l-2 border-transparent pl-3 focus:border-[#8C6D4F] focus:text-[#8C6D4F]"
            >
              Your Rights
            </a>
            <a
              href="#sharing"
              className="block hover:text-[#8C6D4F] transition-colors border-l-2 border-transparent pl-3 focus:border-[#8C6D4F] focus:text-[#8C6D4F]"
            >
              Third-Party Sharing
            </a>
            <a
              href="#contact"
              className="block hover:text-[#8C6D4F] transition-colors border-l-2 border-transparent pl-3 focus:border-[#8C6D4F] focus:text-[#8C6D4F]"
            >
              Contact Our Privacy
            </a>
          </nav>

          {/* Need Help Card Box */}
          <div className="bg-[#F5EFE6] p-6 rounded-lg border border-[#E6DCCE] sticky top-[280px]">
            <h3 className="font-serif text-lg font-bold text-[#4A3E3D] mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-[#6E6259] leading-relaxed mb-4">
              Our specialized team is available to discuss any privacy concerns.
            </p>
            <a
              href="mailto:privacy@lynvistasafaris.com"
              className="text-sm font-medium text-[#8C6D4F] hover:underline block truncate"
            >
              privacy@lynvistasafaris.com
            </a>
          </div>
        </aside>

        {/* Right Main Content Block */}
        <main className="lg:col-span-3 space-y-16 scroll-smooth">
          {/* Section 1: Information We Collect */}
          <section id="collect" className="space-y-6 scroll-mt-8">
            <h2 className="text-3xl font-serif font-bold text-[#4A3E3D] border-b border-[#E6DCCE] pb-3">
              Information We Collect
            </h2>
            <p className="text-[#5C534C] leading-relaxed">
              To provide a truly bespoke safari experience, Lynvista Safaris
              collects limited items of information essential for itinerary
              planning and guest safety.
            </p>

            {/* 2x2 Feature Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="bg-white p-6 rounded-xl border border-[#EADCC9] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3 text-[#8C6D4F]">
                  <IdCard className="w-5 h-5 stroke-[1.5]" />
                  <h4 className="font-serif font-bold text-[#4A3E3D]">
                    Identity Details
                  </h4>
                </div>
                <p className="text-sm text-[#6E6259] leading-relaxed">
                  Full name, passport information, nationality, and
                  government-issued identification required for park permits and
                  border crossings.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#EADCC9] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3 text-[#8C6D4F]">
                  <Compass className="w-5 h-5 stroke-[1.5]" />
                  <h4 className="font-serif font-bold text-[#4A3E3D]">
                    Travel Preferences
                  </h4>
                </div>
                <p className="text-sm text-[#6E6259] leading-relaxed">
                  Dietary requirements, physical health considerations,
                  preferred accommodation styles, and historical safari
                  interests.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#EADCC9] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3 text-[#8C6D4F]">
                  <CreditCard className="w-5 h-5 stroke-[1.5]" />
                  <h4 className="font-serif font-bold text-[#4A3E3D]">
                    Payment Info
                  </h4>
                </div>
                <p className="text-sm text-[#6E6259] leading-relaxed">
                  Encrypted credit card details and transaction history
                  processed through secure, bank-approved gateways.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-[#EADCC9] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3 text-[#8C6D4F]">
                  <Phone className="w-5 h-5 stroke-[1.5]" />
                  <h4 className="font-serif font-bold text-[#4A3E3D]">
                    Contact Info
                  </h4>
                </div>
                <p className="text-sm text-[#6E6259] leading-relaxed">
                  Email address, phone number, and physical mailing address for
                  itinerary delivery and emergency communication.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Data */}
          <section id="use-data" className="space-y-6 scroll-mt-8">
            <h2 className="text-3xl font-serif font-bold text-[#4A3E3D] border-b border-[#E6DCCE] pb-3">
              How We Use Your Data
            </h2>
            <p className="text-[#5C534C] leading-relaxed">
              We believe in the purposeful use of data. Every piece of
              information shared with us is used solely to enhance your journey
              and manage our operations.
            </p>
            <ul className="space-y-4 pt-2">
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-[#8C6D4F] mt-1 shrink-0 stroke-[2.5]" />
                <p className="text-[#5C534C] text-sm leading-relaxed">
                  <strong className="text-[#4A3E3D] font-semibold">
                    Booking Fulfillment:
                  </strong>{" "}
                  Facilitating bookings for luxury lodges, custom safaris, and
                  national park entries.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-[#8C6D4F] mt-1 shrink-0 stroke-[2.5]" />
                <p className="text-[#5C534C] text-sm leading-relaxed">
                  <strong className="text-[#4A3E3D] font-semibold">
                    Personalization:
                  </strong>{" "}
                  Tailoring dietary choices and hospitality services to match
                  your unique interests.
                </p>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="w-4 h-4 text-[#8C6D4F] mt-1 shrink-0 stroke-[2.5]" />
                <p className="text-[#5C534C] text-sm leading-relaxed">
                  <strong className="text-[#4A3E3D] font-semibold">
                    Communication:
                  </strong>{" "}
                  Providing pre-departure briefings and real-time updates during
                  your expedition.
                </p>
              </li>
            </ul>
          </section>

          {/* Section 3: Data Protection & Security Box Callout */}
          <section id="protection" className="scroll-mt-8">
            <div className="bg-[#1C140E] text-[#EADCC9] p-8 md:p-10 rounded-2xl relative overflow-hidden shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-xl">
                <h3 className="text-2xl font-serif font-bold text-white">
                  Data Protection & Security
                </h3>
                <p className="text-sm text-[#D1C4B4] leading-relaxed">
                  We employ military-grade encryption (AES-256) for all data at
                  rest and TLS 1.3 for data in transit. Our critical servers are
                  located in high-security facilities with 24/7 monitoring.
                </p>
                <p className="text-xs text-[#A89A8B] leading-relaxed italic border-t border-[#362A20] pt-3">
                  Access to guest data is strictly limited to authorized
                  personnel on a &apos;need-to-know&apos; basis, governed by
                  rigid internal auditing protocols.
                </p>
              </div>
              <div className="hidden md:block text-[#8C6D4F]/30 pointer-events-none select-none">
                <Lock className="w-16 h-16 stroke-[1]" />
              </div>
            </div>
          </section>

          {/* Section 4: Your Rights */}
          <section id="rights" className="space-y-6 scroll-mt-8">
            <h2 className="text-3xl font-serif font-bold text-[#4A3E3D] border-b border-[#E6DCCE] pb-3">
              Your Rights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-[#FAF4EC] p-6 rounded-xl border border-[#EADCC9]">
                <h4 className="font-serif font-bold text-[#4A3E3D] mb-2">
                  Access
                </h4>
                <p className="text-xs text-[#6E6259] leading-relaxed">
                  Request a comprehensive digital report of all personal data
                  held regarding your profile.
                </p>
              </div>
              <div className="bg-[#FAF4EC] p-6 rounded-xl border border-[#EADCC9]">
                <h4 className="font-serif font-bold text-[#4A3E3D] mb-2">
                  Correction
                </h4>
                <p className="text-xs text-[#6E6259] leading-relaxed">
                  Instantly update any outdated or inaccurate travel preferences
                  or contact details.
                </p>
              </div>
              <div className="bg-[#FAF4EC] p-6 rounded-xl border border-[#EADCC9]">
                <h4 className="font-serif font-bold text-[#4A3E3D] mb-2">
                  Deletion
                </h4>
                <p className="text-xs text-[#6E6259] leading-relaxed">
                  Request the permanent erasure of your profile details
                  following completion of your safari.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Third-Party Sharing */}
          <section id="sharing" className="space-y-6 scroll-mt-8">
            <h2 className="text-3xl font-serif font-bold text-[#4A3E3D] border-b border-[#E6DCCE] pb-3">
              Third-Party Sharing
            </h2>
            <p className="text-[#5C534C] leading-relaxed">
              Lynvista Safaris does not sell your data. We share only necessary
              information with trusted partners specifically involved in your
              itinerary:
            </p>
            {/* Inline Vector Icon Grid Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center pt-2">
              <div className="p-5 bg-white rounded-xl border border-[#EADCC9] flex flex-col items-center justify-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <Tent className="w-6 h-6 text-[#8C6D4F] stroke-[1.5]" />
                <span className="text-xs font-medium text-[#4A3E3D]">
                  Safari Lodges
                </span>
              </div>
              <div className="p-5 bg-white rounded-xl border border-[#EADCC9] flex flex-col items-center justify-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <Plane className="w-6 h-6 text-[#8C6D4F] stroke-[1.5]" />
                <span className="text-xs font-medium text-[#4A3E3D]">
                  Air Charters
                </span>
              </div>
              <div className="p-5 bg-white rounded-xl border border-[#EADCC9] flex flex-col items-center justify-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <Shield className="w-6 h-6 text-[#8C6D4F] stroke-[1.5]" />
                <span className="text-xs font-medium text-[#4A3E3D]">
                  Local Rangers
                </span>
              </div>
              <div className="p-5 bg-white rounded-xl border border-[#EADCC9] flex flex-col items-center justify-center space-y-3 shadow-sm hover:shadow-md transition-shadow">
                <HeartPulse className="w-6 h-6 text-[#8C6D4F] stroke-[1.5]" />
                <span className="text-xs font-medium text-[#4A3E3D]">
                  Emergency Med
                </span>
              </div>
            </div>
          </section>

          {/* Section 6: Contact Our Privacy Team Box Callout */}
          <section id="contact" className="scroll-mt-8">
            <div className="bg-[#FCDFCB] border border-[#E8C4AC] rounded-2xl p-8 text-center space-y-4 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-[#4A3E3D]">
                Dedicated Privacy Concierge
              </h3>
              <p className="text-sm text-[#6E6259] max-w-md mx-auto leading-relaxed">
                For any inquiries regarding data protection, or to exercise your
                privacy rights, please contact our dedicated specialists.
              </p>
              <div className="pt-2">
                <a
                  href="mailto:privacy@lynvistasafaris.com"
                  className="inline-flex items-center space-x-2 bg-[#52341A] text-white font-medium text-sm px-6 py-3 rounded-lg hover:bg-[#3D2511] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#52341A]"
                >
                  <Mail className="w-4 h-4 stroke-[2]" />
                  <span>Contact Privacy Team</span>
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
