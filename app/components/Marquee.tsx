"use client";

import { Fragment } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

const items = translations.marquee.items;

export default function Marquee() {
  const { lang } = useLanguage();

  const renderSet = (prefix: string) =>
    items.map((item, i) => (
      <Fragment key={`${prefix}${i}`}>
        <span className="uppercase tracking-[0.28em] text-[11px] text-[#f5f2ed]/55 shrink-0 px-10 md:px-14 font-medium">
          {item[lang]}
        </span>
        <span className="text-[#c9a96e] shrink-0 text-[7px] leading-none select-none">◆</span>
      </Fragment>
    ));

  return (
    <div
      className="relative overflow-hidden bg-[#050505] border-y border-[#f5f2ed]/[0.07] py-[13px]"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 md:w-32 bg-gradient-to-r from-[#050505] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 md:w-32 bg-gradient-to-l from-[#050505] to-transparent" />

      <div className="text-marquee-viewport overflow-hidden" dir="ltr">
        <div className="text-marquee-track flex items-center">
          {(["a", "b", "c", "d"] as const).map((k) => (
            <div key={k} className="flex items-center shrink-0">
              {renderSet(k)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
