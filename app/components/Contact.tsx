"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";
import ContactModal from "./ContactModal";
import { useReveal } from "@/lib/useReveal";

gsap.registerPlugin(ScrollTrigger);

const WhatsAppIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
);
const LinkedInIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.34 9.67H5.67V18h2.67V9.67zM7 6.1a1.55 1.55 0 100 3.1 1.55 1.55 0 000-3.1zM18.34 18v-4.57c0-2.45-1.31-3.59-3.06-3.59-1.41 0-2.04.78-2.39 1.33v-1.5h-2.67V18h2.67v-4.65c0-1.23.84-1.63 1.5-1.63.64 0 1.28.49 1.28 1.66V18h2.67z"/></svg>
);
const InstagramIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>
);
const MailIcon = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
);

const SOCIALS = [
  { label: "WhatsApp",  href: "https://wa.me/966594381935",                    icon: WhatsAppIcon  },
  { label: "LinkedIn",  href: "https://www.linkedin.com/company/iwin-sa/",     icon: LinkedInIcon  },
  { label: "Instagram", href: "https://www.instagram.com/wiin.solutions/",     icon: InstagramIcon },
  { label: "Email",     href: "mailto:info@iwin-sa.com",                       icon: MailIcon      },
];

export default function Contact() {
  const { t, lang } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLButtonElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);

  const openModal  = useCallback(() => setIsModalOpen(true),  []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  useReveal({
    sectionRef,
    eyebrowRef,
    headingRef,
    contentRefs: [subtextRef, ctaRef],
    triggerStart: "top 80%",
  });

  // Parallax on center glow
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          yPercent: -16,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        id="contact"
        ref={sectionRef}
        className="relative bg-[#0a0a0a] min-h-[88vh] flex flex-col items-center justify-center py-40 px-8 md:px-16 overflow-hidden text-center"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-[#c9a96e]/20" />

        {/* Parallaxed center glow */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="w-[900px] h-[900px] rounded-full bg-[#c9a96e]/[0.038] blur-[180px]" />
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-[clamp(20rem,55vw,48rem)] font-black text-[#f5f2ed]/[0.016] select-none leading-none font-latin">
            ◆
          </span>
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-4xl">
          <p
            ref={eyebrowRef}
            className="uppercase tracking-[0.4em] text-xs text-[#c9a96e] mb-8 flex items-center gap-4"
          >
            <span className="block w-8 h-px bg-[#c9a96e]/60 shrink-0" />
            {t("contact", "eyebrow")}
            <span className="block w-8 h-px bg-[#c9a96e]/60 shrink-0" />
          </p>

          <h2
            key={lang}
            ref={headingRef}
            className="text-6xl md:text-8xl xl:text-[112px] font-black leading-[0.9] text-[#f5f2ed]"
          >
            {t("contact", "heading")}
          </h2>

          <p
            ref={subtextRef}
            className="mt-8 text-base md:text-lg text-[#f5f2ed]/45 max-w-md leading-relaxed"
          >
            {t("contact", "subtext")}
          </p>

          <button
            ref={ctaRef}
            type="button"
            onClick={openModal}
            className="mt-12 px-12 py-4 border border-[#c9a96e] text-[#c9a96e] text-[11px] tracking-[0.35em] uppercase font-bold rounded-full hover:bg-[#c9a96e] hover:text-[#050505] transition-all duration-500 ease-out cursor-pointer"
          >
            {t("contact", "cta")}
          </button>

          {/* Direct channels */}
          <div className="mt-16 flex flex-col items-center gap-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#f5f2ed]/30">
              {lang === "ar" ? "أو تواصل معنا مباشرة" : "Or reach us directly"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-5 md:gap-x-7 gap-y-3">
              {SOCIALS.map((s, i) => (
                <Fragment key={s.label}>
                  {i > 0 && <span className="hidden sm:block h-4 w-px bg-[#c9a96e]/25" aria-hidden="true" />}
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="group flex items-center gap-2.5 text-[#f5f2ed]/65 hover:text-[#c9a96e] transition-colors duration-300"
                  >
                    <span className="text-[#c9a96e]/80 group-hover:text-[#c9a96e] transition-colors duration-300">{s.icon}</span>
                    <span className="text-sm tracking-wide">{s.label}</span>
                  </a>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && <ContactModal onClose={closeModal} />}
    </>
  );
}
