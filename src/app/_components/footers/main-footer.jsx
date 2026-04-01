import { Phone, Mail, MapPin } from "lucide-react";

function MainFooter() {
  const currentYear = new Date().getFullYear();
  const googleMapsUrl =
    "https://www.google.com/maps/place/?q=place_id:ChIJL_ZOJT8XLxgRP-62QIdhFes";

  return (
    <footer className="bg-[#2d1b0b] text-[#faf8f3] py-16">
      <div className="container mx-auto px-6 flex flex-col items-center gap-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#fbbf24] tracking-wider">
            LYNVISTA SAFARIS
          </h2>
          <p className="mt-4 text-gray-400 max-w-md leading-relaxed">
            Your trusted partner for unforgettable African adventures. From
            safaris to beaches, corporate travel to custom itineraries.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 w-full max-w-6xl">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-lg font-semibold mb-6 text-white border-b border-[#fbbf24] pb-1 inline-block">
              Get in Touch
            </h3>
            <div className="space-y-6 text-gray-400">
              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="flex items-center gap-2 text-[#fbbf24]">
                  <Phone size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Call Us
                  </span>
                </div>
                <div className="flex flex-col">
                  <a
                    href="tel:+254718108358"
                    className="hover:text-[#fbbf24] transition-colors"
                  >
                    +254 718 108 358
                  </a>
                  <a
                    href="tel:+254793696522"
                    className="hover:text-[#fbbf24] transition-colors"
                  >
                    +254 793 696 522
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-start gap-2">
                <div className="flex items-center gap-2 text-[#fbbf24]">
                  <Mail size={18} />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Email Us
                  </span>
                </div>
                <a
                  href="mailto:lynvistasafaris@outlook.com"
                  className="hover:text-[#fbbf24] transition-colors"
                >
                  lynvistasafaris@outlook.com
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold mb-6 text-white border-b border-[#fbbf24] pb-1 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-4 text-gray-400">
              <li>
                <a
                  href="/about"
                  className="hover:text-[#fbbf24] transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-[#fbbf24] transition-colors"
                >
                  Travel Blog
                </a>
              </li>
              <li>
                <a
                  href="/book"
                  className="hover:text-[#fbbf24] transition-colors"
                >
                  Book a Trip
                </a>
              </li>
              <li>
                <a
                  href="/destinations"
                  className="hover:text-[#fbbf24] transition-colors"
                >
                  Destinations
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Location */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <h3 className="text-lg font-semibold mb-6 text-white border-b border-[#fbbf24] pb-1 inline-block">
              Our Location
            </h3>

            <div className="space-y-4">
              {/* Linked Address Text */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center md:items-end gap-2 text-gray-400 hover:text-[#fbbf24] transition-colors"
              >
                <div className="flex items-center gap-2 text-[#fbbf24]">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Visit Our Office
                  </span>
                  <MapPin size={18} />
                </div>

                <p className="text-sm leading-relaxed">
                  Westlands Commercial Centre, <br />
                  Old Block, 1st Floor, <br />
                  P.O. Box 10275-00100 Nairobi
                </p>
              </a>

              {/* Linked Mini Map */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden border border-[#5c3d2e] shadow-2xl transition-transform hover:scale-105 duration-300"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.847134375!2d36.8015596!3d-1.260743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173f254ef62f%3A0xeb15618740b6eecf!2sWestlands%20commercial%20center!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                  width="260"
                  height="140"
                  className="border-0 grayscale hover:grayscale-0 transition-all duration-500 pointer-events-none"
                  loading="lazy"
                  title="Lynvista Safaris Location"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-[#5c3d2e] pt-12 text-center">
        <div className="container mx-auto px-6 flex flex-col items-center gap-6">
          <img
            src="/images/initials.WebP"
            alt="Lynvista initials"
            className="h-16 opacity-60 hover:opacity-100 transition-opacity duration-300"
          />
          <p className="text-xs tracking-widest text-gray-500 uppercase">
            © {currentYear} Lynvista Safaris Limited. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;
