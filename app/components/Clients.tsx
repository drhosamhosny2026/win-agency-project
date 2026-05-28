"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLIENT_LOGOS, type ClientLogoEntry } from "@/lib/client-logos";
import { content } from "@/lib/content";

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
          className="object-contain object-center opacity-[0.52] grayscale contrast-[0.95] brightness-[0.92] transition-[opacity,filter] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100"
          unoptimized
        />
      </div>
    </figure>
  );
}

function MarqueeRow({ logos, duplicate }: { logos: ClientLogoEntry[]; duplicate?: boolean }) {
  return (
    <div
      className={`flex items-center ${duplicate ? "client-marquee-duplicate" : ""}`}
      aria-hidden={duplicate ? true : undefined}
    >
      {logos.map((client) => (
        <LogoMark key={`${client.id}${duplicate ? "-dup" : ""}`} client={client} />
      ))}
    </div>
  );
}

export default function Clients() {
  const sectionRef  = useRef<HTMLElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const marqueeRef  = useRef<HTMLDivElement>(null);

  const logos = CLIENT_LOGOS;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Eyebrow label
      gsap.from(eyebrowRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
      });

      // Main heading
      gsap.from(headingRef.current, {
        y: 48,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // Marquee strip fades in as a unit
      gsap.from(marqueeRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        clearProps: "opacity",
        scrollTrigger: {
          trigger: marqueeRef.current,
          start: "top 88%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#f5f2ed] py-28 md:py-36 overflow-hidden"
      aria-label={content.clients.sectionTitle.en}
    >
      <div className="mb-14 md:mb-20 px-8 md:px-16 lg:px-20">
        <p
          ref={eyebrowRef}
          className="uppercase tracking-[0.35em] text-xs md:text-sm text-[#C6A77D]"
        >
          {content.clients.sectionTitle.en}
        </p>
        <h2
          ref={headingRef}
          className="mt-5 text-3xl md:text-5xl lg:text-6xl font-black max-w-3xl leading-[1.05] text-[#111111]"
        >
          Trusted by Leading Brands
        </h2>
      </div>

      <div ref={marqueeRef} className="relative">
        {/* Edge fades */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 md:w-28 lg:w-36 bg-gradient-to-r from-[#f5f2ed] via-[#f5f2ed]/90 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 md:w-28 lg:w-36 bg-gradient-to-l from-[#f5f2ed] via-[#f5f2ed]/90 to-transparent"
          aria-hidden
        />

        <div className="client-marquee-viewport overflow-hidden py-2 md:py-4">
          <div className="client-marquee-track gap-0">
            <MarqueeRow logos={logos} />
            <MarqueeRow logos={logos} duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
