import "./globals.css";

/* Components */
import BodyWrapper from "./_components/wrappers/BodyWrapper";
import AOSWrapper from "./_components/wrappers/AOSWrapper";
import ConditionalLayout from "./_components/wrappers/ConditionalLayout"; // <-- Import the new wrapper

// 1. Viewport Export
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// 2. Metadata Export
export const metadata = {
  metadataBase: new URL("https://lynvistasafaris.com"),
  title: {
    default:
      "Lynvista Safaris | Bespoke Kenya Wildlife Safaris & Luxury Beach Holidays",
    template: "%s | Lynvista Safaris",
  },
  description:
    "Experience the magic of Kenya with Lynvista Safaris. We offer tailored wildlife safari packages, luxury beach holidays, and unforgettable travel experiences for international and local explorers.",
  keywords: [
    "Kenya Safaris",
    "Luxury travel Kenya",
    "Maasai Mara safaris",
    "Kenya beach holidays",
    "Bespoke safari tours",
    "East Africa travel",
    "Lynvista Safaris",
  ],
  authors: [{ name: "Kimberley Madoya" }, { name: "Mitchelle Muthoni" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Lynvista Safaris | Unforgettable Kenya Travel Experiences",
    description:
      "Discover bespoke safari adventures and relaxing beach escapes in Kenya with Lynvista Safaris.",
    url: "https://lynvistasafaris.com",
    siteName: "Lynvista Safaris",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lynvista Safaris | Luxury Kenya Safaris",
    description:
      "Book your dream Kenya safari and beach holiday with Lynvista Safaris.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              name: "Lynvista Safaris Limited",
              url: "https://lynvistasafaris.com",
              description:
                "Bespoke wildlife safaris and luxury beach holidays in Kenya.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "KE",
              },
              priceRange: "$$$",
              image: "https://lynvistasafaris.com/og-image.jpg",
            }),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AOSWrapper>
          <BodyWrapper>
            {/* The wrapper handles the conditional UI rendering */}
            <ConditionalLayout>{children}</ConditionalLayout>
          </BodyWrapper>
        </AOSWrapper>
      </body>
    </html>
  );
}
