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

  const [status,   setStatus]   = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrorMsg("");

    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (!endpoint) {
      setStatus("error");
      setErrorMsg(lang === "ar" ? "حدث خطأ في الإعداد. حاول لاحقاً." : "Configuration error. Please try later.");
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone, email, company }),
      });
      if (res.ok) {
        setStatus("success");
        setName(""); setPhone(""); setEmail(""); setCompany("");
      } else {
        const data = await res.json().catch(() => null);
        const msg = data?.errors?.[0]?.message;
        setStatus("error");
        setErrorMsg(msg || (lang === "ar" ? "تعذّر الإرسال. حاول مرة أخرى." : "Couldn't send. Please try again."));
      }
    } catch {
      setStatus("error");
      setErrorMsg(lang === "ar" ? "تعذّر الاتصال. تحقق من الإنترنت." : "Connection failed. Check your internet.");
    }
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
          className="text-2xl md:text-3xl font-black text-[#f5f2ed] mb-6 leading-tight"
        >
          {t("contact", "modalTitle")}
        </h3>

        {/* WhatsApp quick-contact */}
        <a
          href="https://wa.me/966594381935"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full mb-4 py-[13px] rounded-full border border-[#c9a96e]/40 text-[#c9a96e] text-[12px] tracking-[0.15em] uppercase font-bold hover:bg-[#c9a96e] hover:text-[#050505] transition-all duration-300"
        >
          <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          {lang === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
        </a>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px flex-1 bg-[#f5f2ed]/[0.08]" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#f5f2ed]/30">
            {lang === "ar" ? "أو" : "or"}
          </span>
          <span className="h-px flex-1 bg-[#f5f2ed]/[0.08]" />
        </div>

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
            disabled={status === "submitting"}
            className="mt-3 w-full bg-[#c9a96e] text-[#050505] font-bold text-[11px] tracking-[0.25em] uppercase rounded-full py-[15px] hover:bg-[#f5f2ed] transition-colors duration-[400ms] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "submitting"
              ? (lang === "ar" ? "جارٍ الإرسال…" : "Sending…")
              : t("contact", "formSubmit")}
          </button>

          {status === "success" && (
            <p className="mt-3 text-center text-sm text-[#7bbf8f]">
              {lang === "ar" ? "تم الإرسال! سنتواصل معك قريباً." : "Sent! We'll be in touch shortly."}
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-center text-sm text-[#d98b8b]">{errorMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
}
