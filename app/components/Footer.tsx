"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-[#050505] border-t border-[#f5f2ed]/[0.06] px-8 md:px-16 py-10 md:py-12">

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-8 mb-8 border-b border-[#f5f2ed]/[0.06]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f5f2ed]/30 mb-2">
            {t("contact", "location")}
          </p>
          <p className="text-sm text-[#f5f2ed]/60">
            {t("contact", "locationVal")}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f5f2ed]/30 mb-2">
            {t("contact", "email")}
          </p>
          <a
            href="mailto:Info@iwin-sa.com"
            className="text-sm text-[#f5f2ed]/60 hover:text-[#c9a96e] transition-colors duration-300 font-latin"
          >
            Info@iwin-sa.com
          </a>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f5f2ed]/30 mb-2">
            {t("contact", "phone")}
          </p>
          <a
            href="tel:+966594381935"
            className="text-sm text-[#f5f2ed]/60 hover:text-[#c9a96e] transition-colors duration-300 font-latin"
          >
            +966 59 438 1935
          </a>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[#f5f2ed]/20 text-[11px] tracking-[0.14em]">
        <span className="font-latin">
          © {new Date().getFullYear()} WIN Agency. {t("contact", "rights")}
        </span>
        <span className="text-[#c9a96e]/30 font-latin">Riyadh · KSA</span>
      </div>

    </footer>
  );
}
