"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLIENT_LOGOS, type ClientLogoEntry } from "@/lib/client-logos";
import { useLanguage } from "@/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

function LogoMark({ client }: { client: ClientLogoEntry }) {
  return (
    <figure className="group relative flex h-14 md:h-16 shrink-0 items-center justify-center px-8 md:px-10 lg:px-12">
      <div className="relative w-[100px] h-[40px] md:w-[120px] md:h-[48px]">
        <Image
          fill
          src={client.logo}
          alt={client.alt}
          sizes="(max-width: 768px) 100px, 120px"
          className="object-contain object-center brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
        />
      </div>
    </figure>
  );
}

function MarqueeRow({ logos, duplicate }: { logos: ClientLogoEntry[]; duplicate?: boolean }) {
  return (
    <div
      className={`flex items-center shrink-0 ${duplicate ? "client-marquee-duplicate" : ""}`}
      aria-hidden={duplicate ? "true" : undefined}
    >
      {logos.map((client) => (
        <LogoMark key={`${client.id}${duplicate ? "-dup" : ""}`} client={client} />
      ))}
    </div>
  );
}

export default function Clients() {
  const { t } = useLanguage();

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const logos = CLIENT_LOGOS;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(eyebrowRef.current, {
        y: 20, opacity: 0, duration: 0.9, ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });

      gsap.from(headingRef.current, {
        y: 48, opacity: 0, duration: 1.1, ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      gsap.from(marqueeRef.current, {
        opacity: 0, duration: 1.2, ease: "power2.out",
        clearProps: "opacity",
        scrollTrigger: { trigger: marqueeRef.current, start: "top 88%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#050505] py-28 md:py-36 overflow-hidden"
      aria-label={t("clients", "eyebrow")}
    >
      <div className="absolute top-0 left-8 right-8 md:left-16 md:right-16 h-px bg-[#c9a96e]/20" />

      <div className="mb-14 md:mb-20 px-8 md:px-16 lg:px-20">
        <p
          ref={eyebrowRef}
          className="uppercase tracking-[0.35em] text-xs text-[#c9a96e] flex items-center gap-4"
        >
          <span className="block w-8 h-px bg-[#c9a96e]/60 shrink-0" />
          {t("clients", "eyebrow")}
        </p>
        <h2
          ref={headingRef}
          className="mt-6 text-3xl md:text-5xl lg:text-6xl font-black max-w-3xl leading-[1.05] text-[#f5f2ed]"
        >
          {t("clients", "heading")}
        </h2>
      </div>

      <div ref={marqueeRef} className="relative">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-28 lg:w-36 bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-28 lg:w-36 bg-gradient-to-l from-[#050505] via-[#050505]/90 to-transparent"
          aria-hidden
        />

        <div className="client-marquee-viewport overflow-hidden py-2 md:py-4" dir="ltr">
          <div className="client-marquee-track gap-0">
            <MarqueeRow logos={logos} />
            <MarqueeRow logos={logos} duplicate />
            <MarqueeRow logos={logos} duplicate />
            <MarqueeRow logos={logos} duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
