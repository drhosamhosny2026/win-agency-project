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
    <footer id="contact" ref={sectionRef} className="relative bg-[#050505] py-32 px-8 md:px-16 overflow-hidden">

      {/* Ambient gold glow */}
      <div className="pointer-events-none absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#c9a96e]/[0.035] blur-[140px] rounded-full" />

      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[#f5f2ed]/8" />

      <p ref={eyebrowRef} className="uppercase tracking-[0.35em] text-xs text-[#c9a96e] mb-8 flex items-center gap-4">
        <span className="block w-8 h-px bg-[#c9a96e]/60" />
        Contact
      </p>

      <h2
        ref={headingRef}
        className="text-5xl md:text-8xl font-black leading-[0.92] max-w-5xl text-[#f5f2ed]"
      >
        Where Dreams Begin
      </h2>

      <div ref={gridRef} className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-[#f5f2ed]/8 pt-12">

        <div>
          <p className="text-[#f5f2ed]/35 mb-3 text-xs uppercase tracking-[0.2em]">Location</p>
          <h3 className="text-xl font-semibold text-[#f5f2ed]">Riyadh, Saudi Arabia</h3>
        </div>

        <div>
          <p className="text-[#f5f2ed]/35 mb-3 text-xs uppercase tracking-[0.2em]">Email</p>
          <a
            href="mailto:Info@iwin-sa.com"
            className="text-xl font-semibold text-[#f5f2ed] hover:text-[#c9a96e] transition-colors duration-300"
          >
            Info@iwin-sa.com
          </a>
        </div>

        <div>
          <p className="text-[#f5f2ed]/35 mb-3 text-xs uppercase tracking-[0.2em]">Phone</p>
          <a
            href="tel:+966594381935"
            className="text-xl font-semibold text-[#f5f2ed] hover:text-[#c9a96e] transition-colors duration-300"
          >
            +966 59 438 1935
          </a>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="mt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[#f5f2ed]/20 text-xs tracking-[0.15em]">
        <span>© {new Date().getFullYear()} WIN Agency. All rights reserved.</span>
        <span className="text-[#c9a96e]/40">Riyadh · KSA</span>
      </div>

    </footer>
  );
}
