"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenisInstance, clearLenisInstance } from "@/lib/lenis-scroll";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Touch devices have native momentum scroll — Lenis adds overhead without benefit
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

    setLenisInstance(lenis);
    lenis.on("scroll", () => ScrollTrigger.update());

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      clearLenisInstance();
      lenis.destroy();
    };
  }, []);

  return null;
}
