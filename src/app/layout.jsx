import "./globals.css";

/* Components */
import MainNav from "./_components/headers/main-nav";
import MainFooter from "./_components/footers/main-footer";
import ScrollButton from "./_components/buttons/scroll";
import WhatsAppButton from "./_components/buttons/whatsapp";
import BodyWrapper from "./_components/wrappers/BodyWrapper";
import AOSWrapper from "./_components/wrappers/AOSWrapper";

export const metadata = {
  title: "Lynvista Safaris Limited",
  description:
    "Unforgettable safaris, beach holidays & luxury travel experiences in Kenya.",
};

function RootLayout({ children }) {
  return (
    <>
      {/* Added suppressHydrationWarning to ignore extension-injected attributes */}
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased" suppressHydrationWarning>
          <AOSWrapper>
            <BodyWrapper>
              <MainNav />

              {children}

              <MainFooter />

              <ScrollButton />
              <WhatsAppButton />
            </BodyWrapper>
          </AOSWrapper>
        </body>
      </html>
    </>
  );
}
export default RootLayout;
