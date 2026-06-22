"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content, getClientById } from "@/lib/content";
import { useLanguage } from "@/context/LanguageContext";
import { useReveal } from "@/lib/useReveal";

gsap.registerPlugin(ScrollTrigger);

export default function Award() {
  const { t, lang } = useLanguage();

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const clientRef  = useRef<HTMLParagraphElement>(null);

  const award  = content.awards.items[0];
  const client = getClientById(award.clientId);

  useReveal({ sectionRef, eyebrowRef, headingRef, triggerStart: "top 72%" });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (clientRef.current) {
        gsap.from(clientRef.current, {
          y: 20, opacity: 0, duration: 0.8, ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: clientRef.current, start: "top 88%", once: true },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="award"
      ref={sectionRef}
      className="relative bg-[#0a0a0a] text-[#f5f2ed] py-40 px-8 md:px-16 overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#c9a96e]/4 blur-[120px]" />
      <div className="absolute top-0 left-8 right-8 md:left-16 md:right-16 h-px bg-[#c9a96e]/20" />

      <p ref={eyebrowRef} className="uppercase tracking-[0.35em] text-xs text-[#c9a96e] mb-8 flex items-center gap-4">
        <span className="block w-8 h-px bg-[#c9a96e]/60 shrink-0" />
        {t("award", "eyebrow")}
      </p>

      <h2
        key={lang}
        ref={headingRef}
        className="text-3xl md:text-6xl font-black leading-snug max-w-4xl text-[#f5f2ed]"
      >
        {t("award", "title")}
      </h2>

      <p className="mt-10 text-xl text-[#f5f2ed]/60 max-w-2xl leading-relaxed font-light">
        {lang === "ar"
          ? (award.description as { en: string; ar: string }).ar
          : (award.description as { en: string; ar: string }).en}
      </p>

      {client && (
        <p ref={clientRef} className="mt-8 text-[#c9a96e] text-sm font-medium tracking-[0.2em] uppercase font-latin">
          {client.name}
        </p>
      )}

      <div className="pointer-events-none absolute bottom-10 end-10 md:end-16 text-[12rem] md:text-[18rem] font-black leading-none text-[#f5f2ed]/[0.025] select-none">
        ★
      </div>
    </section>
  );
}
