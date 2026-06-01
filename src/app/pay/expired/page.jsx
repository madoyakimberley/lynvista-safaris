import {
  History,
  ExternalLink,
  Headset,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

export default function Expired() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col justify-between p-6 sm:p-12 md:p-20 lg:p-24 font-sans select-none"
      style={{ backgroundImage: "url('/Expired.WebP')" }}
    >
      {/* Main Content Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center max-w-7xl w-full mx-auto my-auto">
        {/* Left Column: Expiration Message */}
        <div className="lg:col-span-7 flex flex-col space-y-6 text-[#33221A]">
          {/* Tagline */}
          <div className="flex items-center space-x-2 tracking-[0.15em] text-xs font-bold text-[#8C624E] uppercase">
            <History size={14} strokeWidth={2.5} />
            <span>Session Interval Lapsed</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-[4.2rem] font-normal leading-[1.1] tracking-tight text-[#2B1B15]">
            This Journey Link <br />
            Has Expired
          </h1>

          {/* Description */}
          <p className="text-[#594A42] font-normal text-base max-w-xl leading-relaxed antialiased">
            At Lynvista, we prioritize the security of your private itineraries
            and financial details. For your protection, invitation and payment
            links are valid for a limited window. This specific link is no
            longer active.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            {/* Request New Link Button */}
            <a
              href="mailto:admin@lynvistasafaris.com?subject=Requesting%20a%20New%20Journey%20Link&body=Im%20requesting%20a%20new%20link"
              className="bg-[#F0B92B] hover:bg-[#E0AB20] text-[#2B1B15] font-medium text-sm px-6 py-3.5 rounded flex items-center justify-center space-x-2 transition-colors duration-200"
            >
              <span>Request a New Link</span>
              <ExternalLink size={16} strokeWidth={2.5} />
            </a>

            {/* Contact Concierge Button */}
            <a
              href="mailto:info@lynvistasafaris.com"
              className="border border-[#4A3B32] hover:bg-[#4A3B32]/5 text-[#4A3B32] font-medium text-sm px-6 py-3.5 rounded flex items-center justify-center space-x-2 transition-colors duration-200"
            >
              <span>Contact Concierge</span>
              <Headset size={16} strokeWidth={2} />
            </a>
          </div>

          {/* Return Home Link */}
          <div className="pt-10">
            <a
              href="/"
              className="inline-flex items-center space-x-2 text-sm text-[#594A42] hover:text-[#2B1B15] transition-colors duration-200 font-medium"
            >
              <ArrowLeft size={16} strokeWidth={2} />
              <span>Return to Homepage</span>
            </a>
          </div>
        </div>

        {/* Right Column: Security Card Info Panel */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
          <div className="bg-[#FAF8F5]/85 backdrop-blur-md border border-[#EBE6DF] rounded-xl p-8 sm:p-10 max-w-md w-full shadow-sm flex flex-col space-y-6">
            {/* Minimal Decorative Line Accent */}
            <div className="w-10 h-[3px] bg-[#8C624E] rounded"></div>

            {/* Card Content */}
            <div className="space-y-3">
              <h2 className="font-serif text-2xl text-[#2B1B15] font-normal tracking-tight">
                Your Security, Our Priority
              </h2>
              <p className="text-sm text-[#594A42] leading-relaxed">
                Our bespoke travel links are encrypted and time-sensitive to
                ensure your safari planning remains as exclusive and secure as
                the journey itself.
              </p>
            </div>

            {/* Separator Line */}
            <div className="w-full h-[1px] bg-[#EBE6DF]"></div>

            {/* Shield / Suite Verification Footer */}
            <div className="flex items-center space-x-4">
              <div className="bg-[#FCECE4] text-[#C87A53] p-3 rounded-lg flex items-center justify-center shadow-inner">
                <ShieldCheck size={20} strokeWidth={2} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-[0.12em] text-[#8C624E] uppercase">
                  Luxury Standard
                </span>
                <span className="text-sm font-semibold text-[#2B1B15]">
                  Encrypted Booking Suite
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
