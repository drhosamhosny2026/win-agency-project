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
      className="bg-[#111111] text-white py-40 px-8 md:px-16"
    >
      <p ref={eyebrowRef} className="uppercase tracking-[0.3em] text-sm text-[#C6A77D] mb-6">
        {content.awards.sectionTitle.en}
      </p>

      <h2
        ref={headingRef}
        className="text-5xl md:text-8xl font-black leading-[0.95] max-w-5xl"
      >
        {award.title.en}
      </h2>

      <p
        ref={descriptionRef}
        className="mt-10 text-xl text-white/70 max-w-2xl leading-relaxed"
      >
        {award.description.en}
      </p>

      {client && (
        <p ref={clientRef} className="mt-6 text-[#C6A77D] text-lg font-medium">
          Client: {client.name}
        </p>
      )}
    </section>
  );
}
