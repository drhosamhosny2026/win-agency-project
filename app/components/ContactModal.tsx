"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  onClose: () => void;
}

export default function ContactModal({ onClose }: Props) {
  const { t, lang } = useLanguage();

  const overlayRef  = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const isClosing   = useRef(false);

  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [email,   setEmail]   = useState("");
  const [company, setCompany] = useState("");

  /* ── Animate open ── */
  useEffect(() => {
    gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    );
    gsap.fromTo(cardRef.current,
      { scale: 0.92, opacity: 0, y: 32 },
      { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "power3.out", delay: 0.06,
        clearProps: "transform,opacity" }
    );
  }, []);

  /* ── Lock scroll ── */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = useCallback(() => {
    if (isClosing.current) return;
    isClosing.current = true;

    gsap.to(overlayRef.current, { opacity: 0, duration: 0.28, ease: "power2.in" });
    gsap.to(cardRef.current, {
      scale: 0.93, opacity: 0, y: 20, duration: 0.28, ease: "power2.in",
      onComplete: onClose,
    });
  }, [onClose]);

  /* ── Escape key ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect to backend / email service (Resend, EmailJS, etc.)
  };

  const inputCls =
    "w-full bg-[#111111] border border-[#f5f2ed]/[0.08] focus:border-[#c9a96e]/55 outline-none rounded-xl px-5 py-[15px] text-[#f5f2ed] text-sm placeholder:text-[#f5f2ed]/25 transition-colors duration-300";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        className="relative w-full max-w-lg bg-[#0d0d0d] rounded-[28px] border border-[#c9a96e]/15 p-8 md:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.75)]"
      >
        {/* Gold accent line */}
        <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-[#c9a96e]/40 to-transparent" />

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label={lang === "ar" ? "إغلاق" : "Close"}
          className="absolute top-5 end-5 w-9 h-9 flex items-center justify-center rounded-full border border-[#f5f2ed]/10 text-[#f5f2ed]/40 hover:text-[#f5f2ed] hover:border-[#f5f2ed]/30 transition-all duration-300 cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Modal header */}
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a96e] mb-3">
          {t("contact", "eyebrow")}
        </p>
        <h3
          id="contact-modal-title"
          className="text-2xl md:text-3xl font-black text-[#f5f2ed] mb-8 leading-tight"
        >
          {t("contact", "modalTitle")}
        </h3>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="flex flex-col gap-3"
          noValidate
        >
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("contact", "formName")}
            aria-label={t("contact", "formName")}
            className={inputCls}
          />

          <input
            type="tel"
            required
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("contact", "formPhone")}
            aria-label={t("contact", "formPhone")}
            className={inputCls}
          />

          <input
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("contact", "formEmail")}
            aria-label={t("contact", "formEmail")}
            className={inputCls}
          />

          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t("contact", "formCompany")}
            aria-label={t("contact", "formCompany")}
            className={inputCls}
          />

          <button
            type="submit"
            className="mt-3 w-full bg-[#c9a96e] text-[#050505] font-bold text-[11px] tracking-[0.25em] uppercase rounded-full py-[15px] hover:bg-[#f5f2ed] transition-colors duration-[400ms] cursor-pointer"
          >
            {t("contact", "formSubmit")}
          </button>
        </form>
      </div>
    </div>
  );
}
