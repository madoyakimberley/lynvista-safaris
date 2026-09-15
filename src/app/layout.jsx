import "./globals.css";

/* Components */
import BodyWrapper from "./_components/wrappers/BodyWrapper";
import AOSWrapper from "./_components/wrappers/AOSWrapper";
import ConditionalLayout from "./_components/wrappers/ConditionalLayout";

// 1. Viewport Export (Removed maximumScale: 1 for WCAG accessibility compliance)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
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

  // Canonical link prevents duplicate content issues in search indexing
  alternates: {
    canonical: "https://lynvistasafaris.com",
  },

  // Icon metadata ensures your logo displays next to site links in Google search results
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lynvista Safaris - Luxury Kenya Safaris",
      },
    ],
    type: "website",
    locale: "en_KE",
  },

  twitter: {
    card: "summary_large_image",
    title: "Lynvista Safaris | Luxury Kenya Safaris",
    description:
      "Book your dream Kenya safari and beach holiday with Lynvista Safaris.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  // Enhanced multi-entity JSON-LD Schema for Sitelinks & Knowledge Panel eligibility
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://lynvistasafaris.com/#website",
      url: "https://lynvistasafaris.com",
      name: "Lynvista Safaris",
      publisher: {
        "@id": "https://lynvistasafaris.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://lynvistasafaris.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "@id": "https://lynvistasafaris.com/#organization",
      name: "Lynvista Safaris Limited",
      url: "https://lynvistasafaris.com",
      logo: "https://lynvistasafaris.com/logo.png",
      image: "https://lynvistasafaris.com/og-image.jpg",
      description:
        "Bespoke wildlife safaris and luxury beach holidays in Kenya.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "KE",
        addressLocality: "Nairobi",
      },
      priceRange: "$$$",
      areaServed: ["Kenya", "East Africa"],
      sameAs: [
        "https://www.facebook.com/lynvistasafaris",
        "https://www.instagram.com/lynvistasafaris",
        "https://twitter.com/lynvistasafaris",
      ],
    },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AOSWrapper>
          <BodyWrapper>
            <ConditionalLayout>{children}</ConditionalLayout>
          </BodyWrapper>
        </AOSWrapper>
      </body>
    </html>
  );
}
