"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";
import { useReveal } from "@/lib/useReveal";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const { t, lang } = useLanguage();

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const groupsRef  = useRef<HTMLDivElement>(null);

  // Unified heading reveal (SplitText)
  useReveal({ sectionRef, eyebrowRef, headingRef });

  // Groups staggered entrance
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (groupsRef.current) {
        gsap.from(groupsRef.current.children, {
          y: 40, opacity: 0, duration: 0.9, ease: "power2.out",
          stagger: 0.12, clearProps: "transform,opacity",
          scrollTrigger: { trigger: groupsRef.current, start: "top 82%", once: true },
        });
      }
    }, groupsRef);

    return () => ctx.revert();
  }, []);

  // GSAP hover lift — desktop (pointer: fine) only
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cards = groupsRef.current?.querySelectorAll<HTMLElement>(".svc-card");
    if (!cards?.length) return;

    const cleanups: (() => void)[] = [];

    cards.forEach((card) => {
      const onEnter = () => gsap.to(card, { y: -6, duration: 0.35, ease: "power2.out", overwrite: "auto" });
      const onLeave = () => gsap.to(card, { y: 0,  duration: 0.45, ease: "power2.inOut", overwrite: "auto" });

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
        gsap.set(card, { clearProps: "transform" });
      });
    });

    return () => cleanups.forEach((fn) => fn());
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

      <div ref={groupsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {groups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="svc-card group relative h-full flex flex-col bg-[#0d0d0d] rounded-[28px] p-8 md:p-10 border border-[#c9a96e]/12 hover:border-[#c9a96e]/30 transition-colors duration-500 overflow-hidden"
          >
            <div className="pointer-events-none absolute top-0 end-0 w-32 h-32 bg-[#c9a96e]/0 group-hover:bg-[#c9a96e]/[0.04] rounded-es-full transition-colors duration-700" />
            <span className="block text-xs font-medium tracking-[0.3em] text-[#c9a96e]/50 mb-6 font-latin">0{gIdx + 1}</span>
            <h3 className="text-lg md:text-xl font-bold text-[#f5f2ed] mb-5 leading-snug">{group.label[lang]}</h3>
            <div className="w-8 h-px bg-[#c9a96e]/35 mb-5" />
            <ul className="flex flex-col flex-1">
              {group.items.map((item, iIdx) => (
                <li
                  key={iIdx}
                  className={`py-3 text-sm text-[#f5f2ed]/60 leading-snug${
                    iIdx < group.items.length - 1 ? " border-b border-[#f5f2ed]/[0.06]" : ""
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
