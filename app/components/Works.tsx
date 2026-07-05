"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content, getClientById, getMediaById } from "@/lib/content";
import ExpandedPlayer from "./ExpandedPlayer";
import { useLanguage } from "@/context/LanguageContext";
import { useReveal } from "@/lib/useReveal";

gsap.registerPlugin(ScrollTrigger);

type ExpandedCard = { youtubeId: string; title: string; coverSrc: string; rect: DOMRect };

const CATEGORY_COVERS: Record<string, string> = {
  event:       "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&auto=format&fit=crop&q=75",
  sponsorship: "https://images.unsplash.com/photo-1560523159-6b681a1e1852?w=900&auto=format&fit=crop&q=75",
  campaign:    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&auto=format&fit=crop&q=75",
  music:       "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900&auto=format&fit=crop&q=75",
  marketing:   "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=900&auto=format&fit=crop&q=75",
};

export default function Works() {
  const { t, lang } = useLanguage();

  const [expandedCard, setExpandedCard] = useState<ExpandedCard | null>(null);
  const handleCardClose = useCallback(() => setExpandedCard(null), []);

  const sectionRef      = useRef<HTMLElement>(null);
  const eyebrowRef      = useRef<HTMLParagraphElement>(null);
  const headingRef      = useRef<HTMLHeadingElement>(null);
  const featuredRef     = useRef<HTMLDivElement>(null);
  const archiveLabelRef = useRef<HTMLParagraphElement>(null);
  const archiveRef      = useRef<HTMLDivElement>(null);

  const featuredItems = content.work.items.filter((w) => w.featured);
  const archiveItems  = content.work.items.filter((w) => !w.featured);

  // Unified heading reveal
  useReveal({ sectionRef, eyebrowRef, headingRef });

  // Content animations — featured cards, archive label, archive grid
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (featuredRef.current) {
        gsap.from(featuredRef.current.querySelectorAll("article"), {
          y: 64, opacity: 0, duration: 1.1, ease: "power3.out",
          stagger: 0.15, clearProps: "transform,opacity",
          scrollTrigger: { trigger: featuredRef.current, start: "top 80%", once: true },
        });
      }

      if (archiveLabelRef.current) {
        gsap.from(archiveLabelRef.current, {
          y: 20, opacity: 0, duration: 0.8, ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: archiveLabelRef.current, start: "top 85%", once: true },
        });
      }

      if (archiveRef.current) {
        gsap.from(archiveRef.current.querySelectorAll("article"), {
          y: 40, opacity: 0, duration: 0.85, ease: "power2.out",
          stagger: 0.08, clearProps: "transform,opacity",
          scrollTrigger: { trigger: archiveRef.current, start: "top 82%", once: true },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderWorkCard = (
    work: (typeof content.work.items)[number],
    idx: number,
    isFeatured: boolean
  ) => {
    const client       = work.clientId ? getClientById(work.clientId) : null;
    const primaryMedia = work.mediaIds[0] ? getMediaById(work.mediaIds[0]) : null;

    const title =
      "displayTitle" in work && work.displayTitle
        ? (work.displayTitle as { en: string }).en
        : (work.title as { en: string }).en;

    let cover: string;
    if (primaryMedia?.platform === "youtube" && primaryMedia.youtubeId) {
      cover = `https://img.youtube.com/vi/${primaryMedia.youtubeId}/hqdefault.jpg`;
    } else if (
      work.id === "work-eid-song" ||
      work.id === "work-event-gea" ||
      work.id === "work-event-half-million"
    ) {
      cover = `${work.assetsPath}/cover.jpg`;
    } else {
      cover = CATEGORY_COVERS[work.category] ?? `${work.assetsPath}/cover.jpg`;
    }

    let youtubeId: string | null = null;
    let mediaUrl:  string | null = null;

    if (primaryMedia?.platform === "youtube" && primaryMedia.youtubeId) {
      youtubeId = primaryMedia.youtubeId;
      mediaUrl  = primaryMedia.url;
    } else if (
      primaryMedia?.platform === "instagram" ||
      primaryMedia?.platform === "x"          ||
      primaryMedia?.platform === "linkedin"
    ) {
      mediaUrl = primaryMedia.url;
    }

    const handleMediaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (youtubeId) {
        const rect = e.currentTarget.getBoundingClientRect();
        setExpandedCard({ youtubeId, title, coverSrc: cover, rect });
      } else if (mediaUrl) {
        window.open(mediaUrl, "_blank", "noopener,noreferrer");
      }
    };

    const platformLabel =
      primaryMedia?.platform === "instagram" ? "Instagram"
      : primaryMedia?.platform === "x"       ? "X (Twitter)"
      : primaryMedia?.platform === "linkedin" ? "LinkedIn"
      : null;

    if (isFeatured) {
      return (
        <article key={work.id} className={`featured-work-${idx} group`}>
          <div className="works-featured-card relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#111111] mb-8 md:mb-10">
            {mediaUrl ? (
              <button
                type="button"
                onClick={handleMediaClick}
                aria-label={`${t("works", "play")} ${title}`}
                className="block relative w-full aspect-video md:aspect-[16/9] lg:h-[70vh] overflow-hidden cursor-pointer appearance-none border-0 p-0 bg-transparent"
              >
                <Image fill src={cover} alt={title}
                  sizes="(max-width: 768px) 100vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/35 transition-colors duration-300 pointer-events-none">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-white/30 bg-black/30 text-white/60 transition-all duration-300 group-hover:bg-black/60 group-hover:border-white/60 group-hover:text-white group-hover:scale-110">
                    <svg aria-hidden="true" className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </button>
            ) : (
              <div className="relative w-full aspect-video md:aspect-[16/9] lg:h-[70vh] overflow-hidden">
                <Image fill src={cover} alt={title}
                  sizes="(max-width: 768px) 100vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
            <div className="flex-1">
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight mb-3 text-[#f5f2ed] font-latin">
                {title}
              </h3>
              <p className="text-xs uppercase tracking-widest text-[#c9a96e] font-latin">
                {work.categories.join(" · ")}
              </p>
            </div>
            {client && (
              <div className="text-start md:text-end">
                <p className="text-base md:text-lg text-[#f5f2ed]/45 mb-2 font-latin">{client.name}</p>
                {platformLabel && mediaUrl && (
                  <a href={mediaUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-block text-xs md:text-sm font-medium text-[#c9a96e] hover:text-[#f5f2ed] transition-colors duration-300">
                    {t("works", "viewOn")} {platformLabel}
                  </a>
                )}
              </div>
            )}
          </div>
        </article>
      );
    }

    return (
      <article key={work.id} className={`archive-work-${idx} group`}>
        {mediaUrl ? (
          <button
            type="button"
            onClick={handleMediaClick}
            aria-label={`${t("works", "play")} ${title}`}
            className="block relative w-full overflow-hidden rounded-xl md:rounded-2xl bg-[#111111] mb-4 md:mb-6 border border-[#f5f2ed]/5 cursor-pointer appearance-none p-0"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image fill src={cover} alt={title}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/35 transition-colors duration-300 pointer-events-none">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/30 bg-black/30 text-white/60 transition-all duration-300 group-hover:bg-black/60 group-hover:border-white/60 group-hover:text-white group-hover:scale-110">
                <svg aria-hidden="true" className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        ) : (
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-[#111111] mb-4 md:mb-6 border border-[#f5f2ed]/5">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image fill src={cover} alt={title}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
              />
            </div>
          </div>
        )}
        <div>
          <h4 className="text-lg md:text-xl font-bold mb-2 text-[#f5f2ed] font-latin">{title}</h4>
          <p className="text-xs uppercase tracking-widest text-[#c9a96e] mb-2 font-latin">{work.categories.join(" · ")}</p>
          {client && <p className="text-sm text-[#f5f2ed]/40 font-latin">{client.name}</p>}
          {platformLabel && mediaUrl && (
            <a href={mediaUrl} target="_blank" rel="noopener noreferrer"
              className="inline-block text-xs font-medium text-[#c9a96e] hover:text-[#f5f2ed] transition-colors duration-300 mt-2">
              {t("works", "viewOn")} {platformLabel}
            </a>
          )}
        </div>
      </article>
    );
  };

  return (
    <>
      <section ref={sectionRef} id="works" className="relative bg-[#050505] py-24 md:py-32 px-8 md:px-16">
        <div className="absolute top-0 left-8 right-8 md:left-16 md:right-16 h-px bg-[#c9a96e]/20" />

        <p ref={eyebrowRef} className="uppercase tracking-[0.35em] text-xs text-[#c9a96e] mb-6 flex items-center gap-4">
          <span className="block w-8 h-px bg-[#c9a96e]/60 shrink-0" />
          {t("works", "eyebrow")}
        </p>

        <h2 key={lang} ref={headingRef} className="text-5xl md:text-7xl font-black mb-20 max-w-4xl text-[#f5f2ed]">
          {t("works", "heading")}
        </h2>

        {featuredItems.length > 0 && (
          <div ref={featuredRef} className="flex flex-col gap-20 md:gap-28 mb-24 md:mb-36">
            {featuredItems.map((work, idx) => renderWorkCard(work, idx, true))}
          </div>
        )}

        {archiveItems.length > 0 && (
          <>
            <p ref={archiveLabelRef} className="uppercase tracking-[0.3em] text-xs text-[#f5f2ed]/25 mb-10">
              {t("works", "moreWork")}
            </p>
            <div ref={archiveRef} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
              {archiveItems.map((work, idx) => renderWorkCard(work, idx, false))}
            </div>
          </>
        )}
      </section>

      {expandedCard && (
        <ExpandedPlayer
          youtubeId={expandedCard.youtubeId}
          title={expandedCard.title}
          coverSrc={expandedCard.coverSrc}
          originRect={expandedCard.rect}
          onClose={handleCardClose}
        />
      )}
    </>
  );
}
