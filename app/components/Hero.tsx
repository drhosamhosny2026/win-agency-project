"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { lenisScrollTo } from "@/lib/lenis-scroll";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();

  const logoRef    = useRef<HTMLDivElement>(null);
  const nameRef    = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLButtonElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.4 });

      tl.from(logoRef.current, {
        scale: 0.86, opacity: 0, duration: 1.5, ease: "power3.out",
        clearProps: "transform,opacity",
      })
      .from(nameRef.current, {
        y: 22, opacity: 0, duration: 1.0, ease: "power3.out",
        clearProps: "transform,opacity",
      }, "-=0.9")
      .from(dividerRef.current, {
        scaleX: 0, opacity: 0, duration: 0.7, ease: "power2.out",
        clearProps: "transform,opacity",
      }, "-=0.7")
      .from(taglineRef.current, {
        y: 14, opacity: 0, duration: 0.9, ease: "power2.out",
        clearProps: "transform,opacity",
      }, "-=0.5")
      .from(ctaRef.current, {
        y: 16, opacity: 0, duration: 0.8, ease: "power2.out",
        clearProps: "transform,opacity",
      }, "-=0.5")
      .from(scrollRef.current, {
        opacity: 0, duration: 0.8, ease: "power2.out",
        clearProps: "opacity",
      }, "-=0.3");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Ambient gold glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[700px] rounded-full bg-[#c9a96e]/[0.045] blur-[140px]" />
      </div>

      {/* SEO: visually hidden H1 — changes with language client-side */}
      <h1 className="sr-only">{t("hero", "h1")}</h1>

      {/* Center content */}
      <div className="relative flex flex-col items-center text-center px-8">

        {/* Logo */}
        <div ref={logoRef}>
          <Image
            src="/logo.png"
            alt="WIN Solutions"
            width={220}
            height={88}
            className="w-auto h-32 md:h-44"
            priority
          />
        </div>

        {/* Brand name */}
        <p
          ref={nameRef}
          className="mt-8 text-[#c9a96e] text-xl md:text-2xl tracking-[0.65em] uppercase font-light font-latin"
        >
          {t("hero", "brand")}
        </p>

        {/* Gold divider */}
        <div
          ref={dividerRef}
          className="mt-5 w-10 h-px bg-[#c9a96e]/50 origin-center"
        />

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="mt-5 text-[#f5f2ed]/40 text-[10px] md:text-[11px] tracking-[0.5em] uppercase"
        >
          {t("hero", "tagline")}
        </p>

        {/* CTA */}
        <button
          ref={ctaRef}
          type="button"
          onClick={() => lenisScrollTo("#contact")}
          className="mt-10 px-9 py-3 border border-[#c9a96e] text-[#c9a96e] text-xs tracking-[0.35em] uppercase font-medium rounded-full hover:bg-[#c9a96e] hover:text-[#050505] transition-[background-color,color] duration-500 ease-out cursor-pointer"
        >
          {t("hero", "cta")}
        </button>
      </div>

      {/* SCROLL indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] tracking-[0.55em] text-[#c9a96e]/55 uppercase font-light">
          {t("hero", "scroll")}
        </span>
        <div className="w-px h-14 bg-gradient-to-b from-[#c9a96e]/60 to-transparent" />
      </div>
    </section>
  );
}
