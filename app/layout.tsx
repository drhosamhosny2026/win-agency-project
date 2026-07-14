import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { rakik } from "@/lib/fonts";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import { LanguageProvider } from "@/context/LanguageContext";
import { Analytics } from "@vercel/analytics/next";

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
    default: "WIN Solutions | Creative Marketing & Production in Riyadh",
    template: "%s | WIN Solutions",
  },
  description:
    "WIN Solutions is a Saudi creative marketing and production company headquartered in Riyadh. We specialize in visual production, creative campaigns, talent acquisition, and strategic brand partnerships.",
  keywords: [
    "creative solutions riyadh",
    "marketing solutions saudi arabia",
    "visual production riyadh",
    "talent acquisition saudi arabia",
    "creative marketing campaigns",
    "WIN solutions",
    "حلول تسويقية السعودية",
    "شركة إبداعية الرياض",
    "إنتاج مرئي الرياض",
    "استقطاب مواهب",
  ],

  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "WIN Solutions",
    title: "WIN Solutions | Creative Marketing & Production in Riyadh",
    description:
      "A Saudi creative company specializing in artistic production, visual content, creative campaigns, and talent acquisition — headquartered in Riyadh.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        secureUrl: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "WIN Solutions — Creative Marketing & Production",
        type: "image/png",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "WIN Solutions | Creative Marketing & Production in Riyadh",
    description:
      "A Saudi creative company specializing in artistic production, visual content, creative campaigns, and talent acquisition — headquartered in Riyadh.",
    images: ["/og-image.png"],
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
  name: "WIN Solutions",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    "WIN Solutions is a Saudi creative marketing and production company headquartered in Riyadh, founded in 2023.",
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
      email: "info@iwin-sa.com",
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

// Inline script: reads localStorage before first paint to prevent lang/dir FOUC
const langInitScript = `(function(){try{var l=localStorage.getItem('lang');if(l==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${rakik.variable} antialiased`}
    >
      <body className="bg-[#050505] text-[#f5f2ed]">
        {/* Runs synchronously before React hydrates — prevents Arabic FOUC */}
        <script dangerouslySetInnerHTML={{ __html: langInitScript }} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll />
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
