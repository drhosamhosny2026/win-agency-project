"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content, getClientById } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export default function Award() {
  const sectionRef     = useRef<HTMLElement>(null);
  const eyebrowRef     = useRef<HTMLParagraphElement>(null);
  const headingRef     = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const clientRef      = useRef<HTMLParagraphElement>(null);

  const award  = content.awards.items[0];
  const client = getClientById(award.clientId);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: "top 72%" };

      gsap.from(eyebrowRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: trigger,
      });

      gsap.from(headingRef.current, {
        y: 72,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });

      gsap.from(descriptionRef.current, {
        y: 32,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
        delay: 0.1,
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: descriptionRef.current, start: "top 85%" },
      });

      if (clientRef.current) {
        gsap.from(clientRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: clientRef.current, start: "top 88%" },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0a0a0a] text-[#f5f2ed] py-40 px-8 md:px-16 overflow-hidden"
    >
      {/* Ambient gold glow — top-left corner */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#c9a96e]/4 blur-[120px]" />

      {/* Gold rule at top */}
      <div className="absolute top-0 left-8 right-8 md:left-16 md:right-16 h-px bg-[#c9a96e]/20" />

      <p ref={eyebrowRef} className="uppercase tracking-[0.35em] text-xs text-[#c9a96e] mb-8 flex items-center gap-4">
        <span className="block w-8 h-px bg-[#c9a96e]/60" />
        {content.awards.sectionTitle.en}
      </p>

      <h2
        ref={headingRef}
        className="text-5xl md:text-8xl font-black leading-[0.92] max-w-5xl"
      >
        {award.title.en}
      </h2>

      <p
        ref={descriptionRef}
        className="mt-10 text-xl text-[#f5f2ed]/55 max-w-2xl leading-relaxed font-light"
      >
        {award.description.en}
      </p>

      {client && (
        <p ref={clientRef} className="mt-8 text-[#c9a96e] text-sm font-medium tracking-[0.2em] uppercase">
          {client.name}
        </p>
      )}

      {/* Decorative large numeral */}
      <div className="pointer-events-none absolute bottom-10 right-10 md:right-16 text-[12rem] md:text-[18rem] font-black leading-none text-[#f5f2ed]/[0.025] select-none">
        ★
      </div>
    </section>
  );
}
