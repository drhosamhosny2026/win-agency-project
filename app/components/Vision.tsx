"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";
import { useReveal } from "@/lib/useReveal";

gsap.registerPlugin(ScrollTrigger);

export default function Vision() {
  const { t } = useLanguage();

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);

  useReveal({ sectionRef, eyebrowRef, headingRef });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Cards stagger
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          y: 48, opacity: 0, duration: 1.0, ease: "power3.out",
          stagger: 0.15, clearProps: "transform,opacity",
          scrollTrigger: { trigger: cardsRef.current, start: "top 82%", once: true },
        });
      }

      // Parallax on bottom glow (moves upward as you scroll down = depth)
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="vision"
      ref={sectionRef}
      className="relative bg-[#050505] py-36 px-8 md:px-16 overflow-hidden"
    >
      <div className="absolute top-0 left-8 right-8 md:left-16 md:right-16 h-px bg-[#c9a96e]/20" />

      {/* Parallaxed ambient glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#c9a96e]/[0.025] blur-[160px]"
      />

      <p ref={eyebrowRef} className="uppercase tracking-[0.35em] text-xs text-[#c9a96e] mb-8 flex items-center gap-4">
        <span className="block w-8 h-px bg-[#c9a96e]/60 shrink-0" />
        {t("vision", "eyebrow")}
      </p>

      <h2 ref={headingRef} className="text-5xl md:text-7xl font-black mb-16 max-w-4xl text-[#f5f2ed]">
        {t("vision", "heading")}
      </h2>

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group relative bg-[#0d0d0d] rounded-[28px] p-10 md:p-14 border border-[#c9a96e]/12 hover:border-[#c9a96e]/35 transition-colors duration-500 overflow-hidden">
          <div className="pointer-events-none absolute top-0 end-0 w-52 h-52 bg-[#c9a96e]/0 group-hover:bg-[#c9a96e]/[0.03] rounded-es-[28px] transition-colors duration-700" />
          <span className="block text-xs font-medium tracking-[0.3em] text-[#c9a96e]/50 mb-8 font-latin">01</span>
          <p className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-6">{t("vision", "visionLabel")}</p>
          <p className="text-xl md:text-2xl text-[#f5f2ed] leading-[1.75] font-medium">{t("vision", "visionText")}</p>
          <div className="mt-10 w-8 h-px bg-[#c9a96e]/40" />
        </div>

        <div className="group relative bg-[#0d0d0d] rounded-[28px] p-10 md:p-14 border border-[#c9a96e]/12 hover:border-[#c9a96e]/35 transition-colors duration-500 overflow-hidden">
          <div className="pointer-events-none absolute top-0 end-0 w-52 h-52 bg-[#c9a96e]/0 group-hover:bg-[#c9a96e]/[0.03] rounded-es-[28px] transition-colors duration-700" />
          <span className="block text-xs font-medium tracking-[0.3em] text-[#c9a96e]/50 mb-8 font-latin">02</span>
          <p className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-6">{t("vision", "missionLabel")}</p>
          <p className="text-xl md:text-2xl text-[#f5f2ed] leading-[1.75] font-medium">{t("vision", "missionText")}</p>
          <div className="mt-10 w-8 h-px bg-[#c9a96e]/40" />
        </div>
      </div>
    </section>
  );
}
