"use client";

import { Cinzel } from "next/font/google";
import { useLanguage } from "@/context/LanguageContext";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-[#050505] border-t border-[#c9a96e]/10 px-8 md:px-16 py-8 md:py-10">

      {/* Bottom bar — copyright left · ASCENDRA signature right */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        {/* Left: copyright */}
        <div className="flex flex-col gap-1.5 text-[#f5f2ed]/20 text-[11px] tracking-[0.14em] font-latin">
          <span>© {new Date().getFullYear()} WIN Solutions. {t("contact", "rights")}</span>
          <span className="text-[#c9a96e]/30">Riyadh · KSA</span>
        </div>

        {/* Right: ASCENDRA designer signature */}
        <a
          href="https://ascendrabyhosam.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Designed and developed by Ascendra"
          className="group flex items-center gap-5 opacity-60 transition-opacity duration-300 hover:opacity-100"
        >
          {/* Logo mark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ASCENDRA-logo_gold-transparent.svg"
            alt=""
            className="h-12 w-auto md:h-16"
          />

          {/* Vertical divider */}
          <div className="w-px h-14 bg-[#D4AF37]/30 shrink-0" />

          {/* Text column */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#f5f2ed]/35 font-latin">
              DESIGNED &amp; DEVELOPED BY
            </span>
            <span className={`${cinzel.className} text-[19px] tracking-[0.3em] text-[#D4AF37] leading-tight`}>
              ASCENDRA
            </span>
            <span className="text-[12px] text-[#D4AF37]/55 font-latin">
              ascendrabyhosam.com ↗
            </span>
          </div>
        </a>

      </div>

    </footer>
  );
}
