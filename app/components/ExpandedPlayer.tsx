"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { lenisStop, lenisStart } from "@/lib/lenis-scroll";

interface ExpandedPlayerProps {
  youtubeId: string;
  title: string;
  coverSrc: string;
  originRect: DOMRect;
  onClose: () => void;
}

export default function ExpandedPlayer({
  youtubeId,
  title,
  coverSrc,
  originRect,
  onClose,
}: ExpandedPlayerProps) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const onCloseRef    = useRef(onClose);
  const isClosingRef  = useRef(false);
  const [showIframe,    setShowIframe]    = useState(false);
  const [showControls,  setShowControls]  = useState(false);

  // Keep callback ref up-to-date without re-triggering effects
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // Collapse animation — called from both button and ESC key
  const collapse = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    setShowIframe(false);
    setShowControls(false);

    gsap.to(containerRef.current!, {
      top:          originRect.top,
      left:         originRect.left,
      width:        originRect.width,
      height:       originRect.height,
      borderRadius: 24,
      duration:     0.5,
      ease:         "expo.inOut",
      onComplete() {
        lenisStart();
        document.body.style.overflow = "";
        onCloseRef.current();
      },
    });
  };

  // Expand on mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    lenisStop();
    document.body.style.overflow = "hidden";

    // Start exactly at the card's position
    gsap.set(el, {
      top:          originRect.top,
      left:         originRect.left,
      width:        originRect.width,
      height:       originRect.height,
      borderRadius: 24,
    });

    // Animate to fullscreen — use vw/vh so the element always fills the viewport
    const tween = gsap.to(el, {
      top:          0,
      left:         0,
      width:        "100vw",
      height:       "100vh",
      borderRadius: 0,
      duration:     0.65,
      ease:         "expo.out",
      onComplete() {
        setShowIframe(true);
        // Slight delay so iframe starts loading before controls appear
        gsap.delayedCall(0.15, () => setShowControls(true));
      },
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") collapse();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      tween.kill();
      document.removeEventListener("keydown", onKey);
      // Safety: restore scroll if component unmounts unexpectedly
      lenisStart();
      document.body.style.overflow = "";
    };
  }, []); // intentionally runs once on mount only

  return (
    // position + size are controlled entirely by GSAP
    <div
      ref={containerRef}
      className="fixed z-[90] overflow-hidden bg-black"
    >
      {/* Thumbnail — shown during expand / collapse animation */}
      {!showIframe && (
        <img
          src={coverSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* iframe — mounted after expansion completes so it starts fresh */}
      {showIframe && (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
          title={title}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      )}

      {/* Close button — fades in after expansion */}
      <button
        type="button"
        onClick={collapse}
        aria-label="Close player"
        className={`absolute top-5 right-5 z-10 flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/20 bg-black/45 backdrop-blur-sm text-white/65 text-[11px] tracking-[0.15em] uppercase font-medium hover:border-[#c9a96e]/50 hover:text-[#c9a96e] hover:bg-black/65 transition-all duration-300 cursor-pointer ${
          showControls
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
        style={{ transitionProperty: "opacity, transform, color, background-color, border-color" }}
      >
        <svg
          aria-hidden="true"
          className="w-3.5 h-3.5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.75}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Close
      </button>
    </div>
  );
}
