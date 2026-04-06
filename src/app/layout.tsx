import type { Metadata } from "next";

import "./globals.scss";
import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";


export const metadata: Metadata = {
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
} 