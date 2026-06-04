"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const { t, lang } = useLanguage();

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const groupsRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(eyebrowRef.current, {
        y: 20, opacity: 0, duration: 0.9, ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });

      gsap.from(headingRef.current, {
        y: 56, opacity: 0, duration: 1.2, ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      if (groupsRef.current) {
        gsap.from(groupsRef.current.children, {
          y: 48, opacity: 0, duration: 0.9, ease: "power2.out",
          stagger: 0.12, clearProps: "transform,opacity",
          scrollTrigger: { trigger: groupsRef.current, start: "top 82%" },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const groups = translations.services.groups;

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-[#050505] py-32 px-8 md:px-16"
    >
      <p ref={eyebrowRef} className="uppercase tracking-[0.35em] text-xs text-[#c9a96e] mb-6 flex items-center gap-4">
        <span className="block w-8 h-px bg-[#c9a96e]/60 shrink-0" />
        {t("services", "eyebrow")}
      </p>

      <h2 ref={headingRef} className="text-5xl md:text-7xl font-black mb-20 max-w-4xl text-[#f5f2ed]">
        {t("services", "heading")}
      </h2>

      <div ref={groupsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {groups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="group relative bg-[#0d0d0d] rounded-[28px] p-8 md:p-10 border border-[#c9a96e]/12 hover:border-[#c9a96e]/30 transition-colors duration-500 overflow-hidden"
          >
            {/* Corner glow on hover */}
            <div className="pointer-events-none absolute top-0 end-0 w-32 h-32 bg-[#c9a96e]/0 group-hover:bg-[#c9a96e]/[0.04] rounded-es-full transition-colors duration-700" />

            {/* Group number */}
            <span className="block text-xs font-medium tracking-[0.3em] text-[#c9a96e]/50 mb-6 font-latin">
              0{gIdx + 1}
            </span>

            {/* Group label */}
            <h3 className="text-lg md:text-xl font-bold text-[#f5f2ed] mb-5 leading-snug">
              {group.label[lang]}
            </h3>

            {/* Gold divider */}
            <div className="w-8 h-px bg-[#c9a96e]/35 mb-5" />

            {/* Service items */}
            <ul className="flex flex-col">
              {group.items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  className={`py-3 text-sm text-[#f5f2ed]/60 leading-snug${
                    iIdx < group.items.length - 1
                      ? " border-b border-[#f5f2ed]/[0.06]"
                      : ""
                  }`}
                >
                  {item[lang]}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
