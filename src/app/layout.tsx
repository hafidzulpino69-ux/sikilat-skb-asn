import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SIKILAT SKB ASN - Platform Simulasi Ujian CAT BKN Terpercaya",
  description: "Platform latihan dan tryout online SKB ASN/CPNS berbasis CAT BKN dengan bank soal terupdate, pembahasan komprehensif, dan ranking nasional real-time.",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col antialiased bg-[#FCF4E7] text-[#042E64] font-sans selection:bg-[#FB6E09] selection:text-white">
        {children}
      </body>
    </html>
  );
}
