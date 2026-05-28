"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const sectionRef  = useRef<HTMLElement>(null);
  const eyebrowRef  = useRef<HTMLParagraphElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(eyebrowRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
      });

      gsap.from(headingRef.current, {
        y: 64,
        opacity: 0,
        duration: 1.3,
        ease: "power4.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });

      // Contact columns stagger
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          y: 32,
          opacity: 0,
          duration: 0.85,
          ease: "power2.out",
          stagger: 0.1,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: gridRef.current, start: "top 88%" },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer id="contact" ref={sectionRef} className="bg-[#f5f2ed] py-32 px-8 md:px-16">

      <p ref={eyebrowRef} className="uppercase tracking-[0.3em] text-sm text-[#C6A77D] mb-6">
        Contact
      </p>

      <h2
        ref={headingRef}
        className="text-5xl md:text-8xl font-black leading-[0.95] max-w-5xl"
      >
        Where Dreams Begin
      </h2>

      <div ref={gridRef} className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">

        <div>
          <p className="text-black/40 mb-3">Location</p>
          <h3 className="text-2xl font-bold">Riyadh, Saudi Arabia</h3>
        </div>

        <div>
          <p className="text-black/40 mb-3">Email</p>
          <h3 className="text-2xl font-bold">Info@iwin-sa.com</h3>
        </div>

        <div>
          <p className="text-black/40 mb-3">Phone</p>
          <h3 className="text-2xl font-bold">+966 59 438 1935</h3>
        </div>

      </div>

    </footer>
  );
}
