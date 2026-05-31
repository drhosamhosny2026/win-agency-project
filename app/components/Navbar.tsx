"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { lenisScrollTo } from "@/lib/lenis-scroll";

const NAV_LINKS = [
  { label: "Home",     href: "#home"     },
  { label: "Services", href: "#services" },
  { label: "Work",     href: "#works"    },
  { label: "Contact",  href: "#contact"  },
];

export default function Navbar() {
  const navRef        = useRef<HTMLElement>(null);
  const hamburgerRef  = useRef<HTMLButtonElement>(null);
  const overlayRef    = useRef<HTMLDivElement>(null);
  const [open,     setOpen]     = useState(false);
  const [active,   setActive]   = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(nav, { y: -64, opacity: 0 });
    const ctx = gsap.context(() => {
      gsap.to(nav, {
        y: 0, opacity: 1,
        duration: 1.0, ease: "power3.out", delay: 0.15,
        clearProps: "all",
      });
    });
    return () => { ctx.revert(); gsap.set(nav, { clearProps: "all" }); };
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
    const sections = NAV_LINKS
      .map(({ href }) => document.getElementById(href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.4 }
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
      {/* ── Main bar ──────────────────────────────────────────────────────── */}
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
          type="button"
          onClick={() => handleLink("#home")}
          className="text-2xl font-black tracking-tight hover:text-[#c9a96e] transition-colors duration-300 cursor-pointer text-[#f5f2ed]"
        >
          WIN
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.slice(1);
            const isActive = active === id;
            return (
              <button
                key={href}
                type="button"
                onClick={() => handleLink(href)}
                className={`relative pb-0.5 transition-colors duration-300 cursor-pointer ${
                  isActive ? "text-[#c9a96e]" : "text-[#f5f2ed]/50 hover:text-[#f5f2ed]"
                }`}
              >
                {label}
                <span
                  className={`absolute bottom-0 left-0 h-px bg-[#c9a96e] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <button
          type="button"
          onClick={() => handleLink("#contact")}
          className="hidden md:inline-flex items-center border border-[#c9a96e]/40 text-[#f5f2ed] rounded-full px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-[#c9a96e] hover:text-[#050505] hover:border-[#c9a96e] transition-all duration-300 cursor-pointer"
        >
          Let&rsquo;s Talk
        </button>

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
        {/* Subtle gold line at top */}
        <div className="absolute top-0 left-10 right-10 h-px bg-[#c9a96e]/20" />

        {/* Nav items */}
        <ul className="flex flex-col gap-2" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href} className="nav-mobile-item">
              <button
                type="button"
                onClick={() => handleLink(href)}
                className="w-full text-left font-black leading-none text-[clamp(3rem,12vw,6rem)] text-[#f5f2ed] hover:text-[#c9a96e] transition-colors duration-300 cursor-pointer"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Contact detail */}
        <div className="mt-14 border-t border-[#f5f2ed]/10 pt-8 nav-mobile-footer">
          <p className="text-xs uppercase tracking-[0.3em] text-[#c9a96e] mb-3">
            Get in touch
          </p>
          <a
            href="mailto:Info@iwin-sa.com"
            className="text-lg font-medium text-[#f5f2ed] hover:text-[#c9a96e] transition-colors duration-300"
          >
            Info@iwin-sa.com
          </a>
        </div>
      </div>
    </>
  );
}
