"use client";

import { useEffect, useRef } from "react";

interface VideoModalProps {
  youtubeId: string;
  title: string;
  onClose: () => void;
}

export default function VideoModal({ youtubeId, title, onClose }: VideoModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Move focus to close button immediately for keyboard accessibility
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    // Lock body scroll while modal is open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[200] flex items-center justify-center video-modal-overlay"
    >
      {/* Dark backdrop — clicking anywhere outside closes the modal */}
      <div
        className="absolute inset-0 bg-black/90"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Close video"
        className="absolute top-5 right-5 md:top-7 md:right-7 z-10 flex items-center justify-center w-10 h-10 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <svg
          aria-hidden="true"
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Video container */}
      <div className="relative z-10 w-full max-w-5xl px-4 md:px-10 video-modal-content">
        <div className="relative aspect-video overflow-hidden rounded-lg md:rounded-xl bg-black shadow-[0_32px_80px_rgba(0,0,0,0.8)]">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`}
            title={title}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Subtle title caption */}
        <p className="mt-4 text-center text-[11px] tracking-[0.2em] uppercase text-white/25 select-none">
          {title}
        </p>
      </div>
    </div>
  );
}
