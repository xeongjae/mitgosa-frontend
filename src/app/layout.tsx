import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";

import "./globals.scss";

import Header from "@/components/common/Header/Header";
import Footer from "@/components/common/Footer/Footer";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "믿고사 - AI 리뷰 분석 서비스",
  description: "상품 URL을 넣으면 AI가 리뷰를 분석해드립니다.",
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${inter.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}