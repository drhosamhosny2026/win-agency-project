"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface VideoModalProps {
  youtubeId: string;
  title: string;
  onClose: () => void;
}

const TRANSITION_MS = 320; // must match duration-[320ms] in JSX below

export default function VideoModal({ youtubeId, title, onClose }: VideoModalProps) {
  const closeRef   = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const [show, setShow] = useState(false);

  // Keep ref in sync so handleClose never captures a stale onClose
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const handleClose = useCallback(() => {
    setShow(false);
    setTimeout(() => onCloseRef.current(), TRANSITION_MS);
  }, []);

  useEffect(() => {
    // Trigger enter on the next paint so the CSS transition fires
    const raf = requestAnimationFrame(() => setShow(true));
    closeRef.current?.focus();

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [handleClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-[320ms] ease-out ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* ── Blurred dark backdrop ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-[#050505]/75 backdrop-blur-2xl"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* ── Close button ─────────────────────────────────────────────────── */}
      <button
        ref={closeRef}
        type="button"
        onClick={handleClose}
        aria-label="Close video"
        className="absolute top-5 right-5 md:top-7 md:right-7 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#f5f2ed]/15 bg-[#050505]/50 text-[#f5f2ed]/50 text-[11px] tracking-[0.15em] uppercase font-medium hover:border-[#c9a96e]/40 hover:text-[#c9a96e] hover:bg-[#050505]/70 transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a96e]/50 cursor-pointer"
      >
        <svg aria-hidden="true" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Close
      </button>

      {/* ── Video container ───────────────────────────────────────────────── */}
      <div
        className={`relative z-10 w-full max-w-5xl px-4 md:px-10 transition-[opacity,transform] duration-[320ms] ease-out ${
          show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.97]"
        }`}
      >
        {/* iframe with rounded corners and 4-edge fade mask */}
        <div className="relative aspect-video overflow-hidden rounded-[28px] video-fade-mask">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
            title={title}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Title */}
        <p className="mt-5 text-center text-[11px] tracking-[0.25em] uppercase text-[#f5f2ed]/25 select-none">
          {title}
        </p>
      </div>
    </div>
  );
}
