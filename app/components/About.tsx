"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { t } = useLanguage();

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(eyebrowRef.current, {
        y: 20, opacity: 0, duration: 0.9, ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });

      gsap.from(headingRef.current, {
        y: 72, opacity: 0, duration: 1.4, ease: "power4.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      gsap.from(bodyRef.current, {
        y: 36, opacity: 0, duration: 1.1, ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: bodyRef.current, start: "top 85%" },
      });

      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          y: 24, opacity: 0, duration: 0.85, ease: "power2.out",
          stagger: 0.12, clearProps: "transform,opacity",
          scrollTrigger: { trigger: statsRef.current, start: "top 88%" },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-[#0a0a0a] py-36 px-8 md:px-16 overflow-hidden"
    >
      {/* Top separator */}
      <div className="absolute top-0 left-8 right-8 md:left-16 md:right-16 h-px bg-[#c9a96e]/20" />

      {/* Ambient gold glow — top end corner */}
      <div className="pointer-events-none absolute -top-40 end-0 w-[700px] h-[700px] rounded-full bg-[#c9a96e]/[0.03] blur-[180px]" />

      {/* "WIN" watermark */}
      <div className="pointer-events-none absolute bottom-0 start-0 translate-y-[30%] text-[clamp(8rem,28vw,20rem)] font-black text-[#f5f2ed]/[0.018] select-none leading-none font-latin">
        WIN
      </div>

      <p ref={eyebrowRef} className="uppercase tracking-[0.35em] text-xs text-[#c9a96e] mb-10 flex items-center gap-4">
        <span className="block w-8 h-px bg-[#c9a96e]/60 shrink-0" />
        {t("about", "eyebrow")}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-start relative z-10">

        {/* Heading + stats */}
        <div>
          <h2
            ref={headingRef}
            className="text-5xl md:text-7xl xl:text-[88px] font-black leading-[0.9] text-[#f5f2ed]"
          >
            {t("about", "heading")}
          </h2>

          <div ref={statsRef} className="mt-14 flex flex-wrap gap-10 md:gap-14">
            <div>
              <p className="text-4xl md:text-5xl font-black text-[#c9a96e] font-latin">2023</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#f5f2ed]/35">
                {t("about", "statFounded")}
              </p>
            </div>

            <div className="w-px self-stretch bg-[#f5f2ed]/10" />

            <div>
              <p className="text-4xl md:text-5xl font-black text-[#c9a96e] font-latin">4+</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#f5f2ed]/35">
                {t("about", "statServices")}
              </p>
            </div>

            <div className="w-px self-stretch bg-[#f5f2ed]/10" />

            <div>
              <p className="text-4xl md:text-5xl font-black text-[#c9a96e] font-latin">KSA</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-[#f5f2ed]/35">
                {t("about", "statBase")}
              </p>
            </div>
          </div>
        </div>

        {/* Body text */}
        <div className="lg:pt-6">
          <p
            ref={bodyRef}
            className="text-lg md:text-xl text-[#f5f2ed]/60 leading-[1.95] max-w-xl"
          >
            {t("about", "body")}
          </p>
          <div className="mt-10 w-12 h-px bg-[#c9a96e]/40" />
        </div>

      </div>
    </section>
  );
}
