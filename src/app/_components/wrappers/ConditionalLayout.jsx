// _components/wrappers/ConditionalLayout.jsx
"use client";

import { usePathname } from "next/navigation";
import MainNav from "../headers/main-nav";
import MainFooter from "../footers/main-footer";
import ScrollButton from "../buttons/scroll";
import WhatsAppButton from "../buttons/whatsapp";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  // Check if the current route is an admin route
  const isAdminRoute = pathname?.startsWith("/admin");

  // If on an admin page, only render the children (no nav/footer)
  if (isAdminRoute) {
    return <main id="main-content">{children}</main>;
  }

  // Otherwise, render the full public layout
  return (
    <>
      <MainNav />
      <main id="main-content">{children}</main>
      <MainFooter />
      <ScrollButton />
      <WhatsAppButton />
    </>
  );
}
