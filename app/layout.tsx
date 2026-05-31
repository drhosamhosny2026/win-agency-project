import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "WIN Agency",
  description: "Creative Marketing Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body className="bg-[#050505] text-[#f5f2ed]">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
