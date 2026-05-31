"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef  = useRef<HTMLElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);

  const services = content.services.groups;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
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

      gsap.from(headingRef.current, {
        y: 56,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(sectionRef.current!.querySelectorAll(".service-card"), {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.1,
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: sectionRef.current!.querySelector(".service-card"),
          start: "top 82%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="bg-[#050505] py-32 px-8 md:px-16"
    >
      <p ref={eyebrowRef} className="uppercase tracking-[0.35em] text-xs text-[#c9a96e] mb-6 flex items-center gap-4">
        <span className="block w-8 h-px bg-[#c9a96e]/60" />
        {content.services.sectionTitle.en}
      </p>

      <h2 ref={headingRef} className="text-5xl md:text-7xl font-black mb-20 max-w-4xl text-[#f5f2ed]">
        Creative Solutions Built For Impact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="service-card group relative bg-[#0d0d0d] rounded-[28px] p-10 border border-[#f5f2ed]/6 hover:border-[#c9a96e]/25 transition-colors duration-500 overflow-hidden"
          >
            {/* Subtle gold corner glow on hover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a96e]/0 group-hover:bg-[#c9a96e]/4 rounded-bl-full transition-colors duration-700 pointer-events-none" />

            {/* Gold number */}
            <span className="block text-xs font-medium tracking-[0.3em] text-[#c9a96e]/50 mb-6 uppercase">
              0{services.indexOf(service) + 1}
            </span>

            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-[#f5f2ed]">
              {service.title.en}
            </h3>

            <div className="w-8 h-px bg-[#c9a96e]/40 mb-6" />

            <ul className="space-y-3 text-[#f5f2ed]/45 text-base leading-relaxed font-light">
              {service.items.map((item) => (
                <li key={item.en} className="flex items-start gap-3">
                  <span className="mt-2 block w-1 h-1 rounded-full bg-[#c9a96e]/50 shrink-0" />
                  {item.en}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
