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
    <section id="home" className="min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center px-8 md:px-16 pt-32 gap-16 bg-[#f5f2ed]">

      {/* Left */}
      <div>
        <p
          ref={eyebrowRef}
          className="uppercase tracking-[0.3em] text-sm mb-6 text-[#C6A77D]"
        >
          Creative Marketing Agency
        </p>

        <h1
          ref={titleRef}
          className="text-[72px] md:text-[140px] leading-[0.9] font-black"
        >
          Where Dreams Begin
        </h1>

        <p
          ref={textRef}
          className="mt-10 text-lg md:text-2xl max-w-xl leading-relaxed text-black/70"
        >
          A Saudi creative entity crafting impactful experiences through
          marketing, music, events, and storytelling.
        </p>
      </div>

      {/* Right */}
      <div
        ref={videoRef}
        className="relative h-[70vh] rounded-[40px] overflow-hidden bg-black"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-90"
          src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4"
        />
      </div>

    </section>
  );
}
