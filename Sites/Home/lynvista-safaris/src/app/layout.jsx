// src/app/layout.jsx

import "./globals.css";

export const metadata = {
  title: "Lynvista Safaris",
  description: "Explore Kenya with Lynvista Safaris",
};

// default export of a React component
function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
export default RootLayout;
