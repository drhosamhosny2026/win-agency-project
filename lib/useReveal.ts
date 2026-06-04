"use client";

/**
 * useReveal — unified luxury reveal animation.
 *
 * Eyebrow  : fade + y:16, once
 * Heading  : SplitText line-by-line from y:56 + opacity, stagger 0.08s
 * Content  : sequential fade + y:28 after heading
 *
 * All triggers fire once. RTL-safe (y animation is direction-agnostic).
 * SplitText is reverted after animation (restores original DOM).
 */

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Structural ref type — accepts any React ref holding an HTMLElement subclass
type ElemRef = { readonly current: HTMLElement | null };

interface UseRevealOptions {
  sectionRef:    ElemRef;
  eyebrowRef?:   ElemRef;
  headingRef?:   ElemRef;
  /** Individual elements that fade in sequentially after the heading */
  contentRefs?:  ElemRef[];
  triggerStart?: string;
}

export function useReveal({
  sectionRef,
  eyebrowRef,
  headingRef,
  contentRefs = [],
  triggerStart = "top 78%",
}: UseRevealOptions) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      const st = { trigger: sectionRef.current, start: triggerStart, once: true };

      /* ── Eyebrow ─────────────────────────────────────────────────── */
      if (eyebrowRef?.current) {
        gsap.from(eyebrowRef.current, {
          y: 16, opacity: 0, duration: 0.75, ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: st,
        });
      }

      /* ── Heading — SplitText line reveal ─────────────────────────── */
      if (headingRef?.current) {
        const split = new SplitText(headingRef.current, { type: "lines" });
        splits.push(split);

        gsap.from(split.lines, {
          y: 56,
          opacity: 0,
          duration: 1.0,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "transform,opacity",
          scrollTrigger: st,
          onComplete() { split.revert(); },
        });
      }

      /* ── Content elements ────────────────────────────────────────── */
      contentRefs.forEach((ref, i) => {
        if (!ref?.current) return;
        gsap.from(ref.current, {
          y: 28, opacity: 0, duration: 0.9, ease: "power2.out",
          delay: 0.12 + i * 0.08,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });
      });
    }, sectionRef.current!);

    return () => {
      splits.forEach((s) => { try { s.revert(); } catch (_) {} });
      ctx.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
