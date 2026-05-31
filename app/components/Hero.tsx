"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const textRef    = useRef<HTMLParagraphElement>(null);
  const videoRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(eyebrowRef.current, {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform,opacity",
      })
        .from(
          titleRef.current,
          { y: 100, opacity: 0, duration: 1.3, ease: "power4.out", clearProps: "transform,opacity" },
          "-=0.55"
        )
        .from(
          textRef.current,
          { y: 32, opacity: 0, duration: 1.0, ease: "power3.out", clearProps: "transform,opacity" },
          "-=0.75"
        )
        .from(
          videoRef.current,
          { scale: 1.1, opacity: 0, duration: 1.6, ease: "power3.out", clearProps: "transform,opacity" },
          "-=1.1"
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center px-8 md:px-16 pt-32 gap-16 bg-[#050505]">

      {/* Left */}
      <div>
        {/* Gold eyebrow with subtle line */}
        <p
          ref={eyebrowRef}
          className="uppercase tracking-[0.35em] text-xs mb-8 text-[#c9a96e] flex items-center gap-4"
        >
          <span className="block w-8 h-px bg-[#c9a96e]/60" />
          Creative Marketing Agency
        </p>

        <h1
          ref={titleRef}
          className="text-[clamp(3.5rem,10vw,8.75rem)] leading-[0.88] font-black text-[#f5f2ed]"
        >
          Where Dreams Begin
        </h1>

        <p
          ref={textRef}
          className="mt-10 text-lg md:text-xl max-w-xl leading-relaxed text-[#f5f2ed]/55 font-light"
        >
          A Saudi creative entity crafting impactful experiences through
          marketing, music, events, and storytelling.
        </p>
      </div>

      {/* Right — video panel */}
      <div
        ref={videoRef}
        className="hero-video-panel relative h-[70vh] rounded-[40px] overflow-hidden"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-85"
          src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4"
        />
        {/* Subtle bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#050505]/60 to-transparent pointer-events-none" />
        {/* Gold corner accent */}
        <div className="absolute top-6 right-6 w-12 h-12 border-t border-r border-[#c9a96e]/30 rounded-tr-[20px] pointer-events-none" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-[#c9a96e]/30 rounded-bl-[20px] pointer-events-none" />
      </div>

    </section>
  );
}
