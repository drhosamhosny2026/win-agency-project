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
      // Eyebrow
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

      // Heading
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

      // Service cards — staggered entrance
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
      className="bg-[#f5f2ed] py-32 px-8 md:px-16"
    >
      <p ref={eyebrowRef} className="uppercase tracking-[0.3em] text-sm text-[#C6A77D] mb-6">
        {content.services.sectionTitle.en}
      </p>

      <h2 ref={headingRef} className="text-5xl md:text-7xl font-black mb-20 max-w-4xl">
        Creative Solutions Built For Impact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="service-card bg-white rounded-[32px] p-10 border border-black/5"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              {service.title.en}
            </h3>

            <ul className="space-y-3 text-black/60 text-lg leading-relaxed">
              {service.items.map((item) => (
                <li key={item.en}>{item.en}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
