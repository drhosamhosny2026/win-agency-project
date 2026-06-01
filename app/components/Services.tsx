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

      gsap.from(sectionRef.current!.querySelectorAll(".service-card"), {
        y: 48, opacity: 0, duration: 0.9, ease: "power2.out",
        stagger: 0.1, clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: sectionRef.current!.querySelector(".service-card"),
          start: "top 82%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const services = translations.services.items;

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="service-card group relative bg-[#0d0d0d] rounded-[28px] p-10 border border-[#c9a96e]/12 hover:border-[#c9a96e]/35 transition-colors duration-500 overflow-hidden"
          >
            {/* Gold corner glow on hover — logical corner (end/top) */}
            <div className="absolute top-0 end-0 w-32 h-32 bg-[#c9a96e]/0 group-hover:bg-[#c9a96e]/4 rounded-es-full transition-colors duration-700 pointer-events-none" />

            {/* Gold number — always Latin */}
            <span className="block text-xs font-medium tracking-[0.3em] text-[#c9a96e]/50 mb-8 font-latin">
              0{idx + 1}
            </span>

            <h3 className="text-2xl md:text-4xl font-bold mb-6 text-[#f5f2ed] leading-snug">
              {service[lang]}
            </h3>

            <div className="w-8 h-px bg-[#c9a96e]/40" />
          </div>
        ))}
      </div>
    </section>
  );
}
