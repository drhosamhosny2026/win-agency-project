"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { lenisScrollTo } from "@/lib/lenis-scroll";
import { useLanguage } from "@/context/LanguageContext";

const NAV_KEYS = [
  { key: "home"     as const, href: "#home"     },
  { key: "services" as const, href: "#services" },
  { key: "work"     as const, href: "#works"    },
  { key: "about"    as const, href: "#about"    },
  { key: "contact"  as const, href: "#contact"  },
];

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();

  const navRef        = useRef<HTMLElement>(null);
  const logoRef       = useRef<HTMLButtonElement>(null);
  const linksRef      = useRef<HTMLDivElement>(null);
  const actionsRef    = useRef<HTMLDivElement>(null);
  const hamburgerRef  = useRef<HTMLButtonElement>(null);
  const overlayRef    = useRef<HTMLDivElement>(null);

  const [open,     setOpen]     = useState(false);
  const [active,   setActive]   = useState("home");
  const [scrolled, setScrolled] = useState(false);

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  /* ── Staggered entrance: logo → links → actions ────────────────────── */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const logo      = logoRef.current;
    const links     = linksRef.current;
    const actions   = actionsRef.current;
    const hamburger = hamburgerRef.current;

    if (!logo) return;

    // Set everything invisible before first paint
    gsap.set(logo, { y: -14, opacity: 0 });
    if (links?.children.length)   gsap.set(links.children,   { y: -10, opacity: 0 });
    if (actions?.children.length) gsap.set(actions.children, { y: -10, opacity: 0 });
    if (hamburger)                gsap.set(hamburger,         { y: -10, opacity: 0 });

    const tl = gsap.timeline({ delay: 0.15 });

    tl.to(logo, {
      y: 0, opacity: 1, duration: 0.65, ease: "power2.out",
      clearProps: "transform,opacity",
    });

    if (links?.children.length) {
      tl.to(links.children, {
        y: 0, opacity: 1, duration: 0.5, ease: "power2.out",
        stagger: 0.05, clearProps: "transform,opacity",
      }, "-=0.38");
    }

    if (actions?.children.length) {
      tl.to(actions.children, {
        y: 0, opacity: 1, duration: 0.45, ease: "power2.out",
        stagger: 0.05, clearProps: "transform,opacity",
      }, "-=0.28");
    }

    if (hamburger) {
      tl.to(hamburger, {
        y: 0, opacity: 1, duration: 0.5, ease: "power2.out",
        clearProps: "transform,opacity",
      }, "<");
    }

    return () => {
      tl.kill();
      const targets = [logo, links?.children, actions?.children, hamburger].filter(Boolean);
      targets.forEach((t) => t && gsap.set(t, { clearProps: "all" }));
    };
  }, []);

  useEffect(() => {
    hamburgerRef.current?.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      overlayRef.current?.removeAttribute("aria-hidden");
    } else {
      overlayRef.current?.setAttribute("aria-hidden", "true");
    }
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ALL_IDS = ["home", "services", "works", "award", "about", "vision", "contact"];
    const sections = ALL_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLink = (href: string) => {
    const wasOpen = open;
    setOpen(false);
    setTimeout(() => lenisScrollTo(href), wasOpen ? 320 : 0);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 px-8 md:px-16 py-6 flex items-center justify-between transition-[background,box-shadow] duration-500 ${
          scrolled
            ? "bg-[#050505]/90 backdrop-blur-md shadow-[0_1px_0_rgba(245,242,237,0.06)]"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <button
          ref={logoRef}
          type="button"
          onClick={() => handleLink("#home")}
          aria-label="WIN Solutions – back to top"
          className="cursor-pointer p-0 bg-transparent border-0 appearance-none hover:opacity-80 transition-opacity duration-300"
        >
          <Image
            src="/logo.png"
            alt="WIN Solutions"
            width={100}
            height={40}
            className="block h-[40px] w-auto mix-blend-screen"
            priority
          />
        </button>

        {/* Desktop links */}
        <div ref={linksRef} className="hidden md:flex items-center gap-10 text-sm font-medium">
          {NAV_KEYS.map(({ key, href }) => {
            const id = href.slice(1);
            const isActive = active === id;
            return (
              <button
                key={href}
                type="button"
                onClick={() => handleLink(href)}
                className={`relative pb-1 cursor-pointer transition-[color,opacity] duration-500 ease-out font-latin ${
                  isActive
                    ? "text-[#c9a96e]"
                    : "text-[#f5f2ed]/50 hover:text-[#f5f2ed] hover:opacity-100"
                }`}
              >
                {t("nav", key)}
                <span
                  className={`absolute bottom-0 ltr:left-0 rtl:right-0 h-px w-full bg-[#c9a96e] ltr:origin-left rtl:origin-right transition-transform duration-500 ease-out ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Desktop right: lang toggle + CTA */}
        <div ref={actionsRef} className="hidden md:flex items-center gap-4">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
            className="text-[11px] tracking-[0.18em] font-medium border border-[#c9a96e]/30 text-[#c9a96e]/65 hover:text-[#c9a96e] hover:border-[#c9a96e]/65 rounded-full px-3.5 py-1.5 transition-all duration-300 cursor-pointer font-latin"
          >
            {t("nav", "langToggle")}
          </button>

          <button
            type="button"
            onClick={() => handleLink("#contact")}
            className="inline-flex items-center border border-[#c9a96e]/40 text-[#f5f2ed] rounded-full px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-[#c9a96e] hover:text-[#050505] hover:border-[#c9a96e] transition-all duration-300 cursor-pointer"
          >
            {t("nav", "cta")}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={hamburgerRef}
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded="false"
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-[5px] p-1 cursor-pointer"
        >
          <span className={`block w-6 h-[1.5px] bg-[#f5f2ed] origin-center transition-transform duration-300 ${open ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`block w-6 h-[1.5px] bg-[#f5f2ed] transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-6 h-[1.5px] bg-[#f5f2ed] origin-center transition-transform duration-300 ${open ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>
      </nav>

      {/* ── Mobile fullscreen overlay ──────────────────────────────────────── */}
      <div
        ref={overlayRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-[#050505] flex flex-col justify-center px-10 md:hidden transition-opacity duration-300 ${
          open ? "nav-mobile-open opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute top-0 left-10 right-10 h-px bg-[#c9a96e]/20" />

        <ul className="flex flex-col gap-2" role="list">
          {NAV_KEYS.map(({ key, href }) => {
            const isActive = active === href.slice(1);
            return (
              <li key={href} className="nav-mobile-item">
                <button
                  type="button"
                  onClick={() => handleLink(href)}
                  className={`w-full text-start font-black leading-none text-[clamp(3rem,12vw,6rem)] cursor-pointer transition-[color,opacity] duration-500 ease-out font-latin ${
                    isActive ? "text-[#c9a96e]" : "text-[#f5f2ed]/70 hover:text-[#f5f2ed]"
                  }`}
                >
                  {t("nav", key)}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-14 border-t border-[#f5f2ed]/10 pt-8 nav-mobile-footer">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[#c9a96e]">
              {t("nav", "getInTouch")}
            </p>
            <button
              type="button"
              onClick={toggleLang}
              aria-label={lang === "en" ? "Switch to Arabic" : "Switch to English"}
              className="text-[11px] tracking-[0.18em] font-medium border border-[#c9a96e]/30 text-[#c9a96e]/65 hover:text-[#c9a96e] hover:border-[#c9a96e]/65 rounded-full px-3.5 py-1.5 transition-all duration-300 cursor-pointer font-latin"
            >
              {t("nav", "langToggle")}
            </button>
          </div>
          <a
            href="mailto:info@iwin-sa.com"
            className="text-lg font-medium text-[#f5f2ed] hover:text-[#c9a96e] transition-colors duration-300 font-latin"
          >
            info@iwin-sa.com
          </a>
        </div>
      </div>
    </>
  );
}
