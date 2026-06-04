"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";
import ContactModal from "./ContactModal";
import { useReveal } from "@/lib/useReveal";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLButtonElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);

  const openModal  = useCallback(() => setIsModalOpen(true),  []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  useReveal({
    sectionRef,
    eyebrowRef,
    headingRef,
    contentRefs: [subtextRef, ctaRef],
    triggerStart: "top 80%",
  });

  // Parallax on center glow
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          yPercent: -16,
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
    <>
      <section
        id="contact"
        ref={sectionRef}
        className="relative bg-[#0a0a0a] min-h-[88vh] flex flex-col items-center justify-center py-40 px-8 md:px-16 overflow-hidden text-center"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-[#c9a96e]/20" />

        {/* Parallaxed center glow */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="w-[900px] h-[900px] rounded-full bg-[#c9a96e]/[0.038] blur-[180px]" />
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-[clamp(20rem,55vw,48rem)] font-black text-[#f5f2ed]/[0.016] select-none leading-none font-latin">
            ◆
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-4xl">
          <p
            ref={eyebrowRef}
            className="uppercase tracking-[0.4em] text-xs text-[#c9a96e] mb-8 flex items-center gap-4"
          >
            <span className="block w-8 h-px bg-[#c9a96e]/60 shrink-0" />
            {t("contact", "eyebrow")}
            <span className="block w-8 h-px bg-[#c9a96e]/60 shrink-0" />
          </p>

          <h2
            ref={headingRef}
            className="text-6xl md:text-8xl xl:text-[112px] font-black leading-[0.9] text-[#f5f2ed]"
          >
            {t("contact", "heading")}
          </h2>

          <p
            ref={subtextRef}
            className="mt-8 text-base md:text-lg text-[#f5f2ed]/45 max-w-md leading-relaxed"
          >
            {t("contact", "subtext")}
          </p>

          <button
            ref={ctaRef}
            type="button"
            onClick={openModal}
            className="mt-12 px-12 py-4 border border-[#c9a96e] text-[#c9a96e] text-[11px] tracking-[0.35em] uppercase font-bold rounded-full hover:bg-[#c9a96e] hover:text-[#050505] transition-all duration-500 ease-out cursor-pointer"
          >
            {t("contact", "cta")}
          </button>
        </div>
      </section>

      {isModalOpen && <ContactModal onClose={closeModal} />}
    </>
  );
}
