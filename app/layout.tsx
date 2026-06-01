import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { rakik } from "@/lib/fonts";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import { LanguageProvider } from "@/context/LanguageContext";

// ─── Update this to the live domain when deployed ───────────────────────────
const BASE_URL = "https://iwin-sa.com";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: "WIN | Creative Marketing & Production Agency in Riyadh",
    template: "%s | WIN Agency",
  },
  description:
    "WIN is a Saudi creative marketing and production agency headquartered in Riyadh. We specialize in artistic & visual production, creative campaigns, talent acquisition, and strategic brand partnerships.",
  keywords: [
    "creative agency riyadh",
    "marketing agency saudi arabia",
    "visual production riyadh",
    "talent acquisition saudi arabia",
    "creative marketing campaigns",
    "WIN agency",
    "وكالة تسويق السعودية",
    "وكالة إبداعية الرياض",
    "إنتاج مرئي الرياض",
    "استقطاب مواهب",
  ],

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "WIN Agency",
    title: "WIN | Creative Marketing & Production Agency in Riyadh",
    description:
      "A Saudi creative agency specializing in artistic production, visual content, creative campaigns, and talent acquisition — headquartered in Riyadh.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "WIN Agency — Creative Marketing & Production",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "WIN | Creative Marketing & Production Agency in Riyadh",
    description:
      "A Saudi creative agency specializing in artistic production, visual content, creative campaigns, and talent acquisition — headquartered in Riyadh.",
    images: ["/logo.png"],
  },

  alternates: {
    canonical: BASE_URL,
    languages: {
      "en":    BASE_URL,
      "ar-SA": BASE_URL,
    },
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WIN Agency",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    "WIN is a Saudi creative marketing and production agency headquartered in Riyadh, founded in 2023.",
  foundingDate: "2023",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Riyadh",
    addressRegion: "Riyadh Province",
    addressCountry: "SA",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+966-59-438-1935",
      contactType: "customer service",
      email: "Info@iwin-sa.com",
      areaServed: "SA",
      availableLanguage: ["Arabic", "English"],
    },
  ],
  knowsAbout: [
    "Creative Marketing",
    "Visual Production",
    "Artistic Production",
    "Talent Acquisition",
    "Brand Partnerships",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${rakik.variable} antialiased`}>
      <body className="bg-[#050505] text-[#f5f2ed]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
