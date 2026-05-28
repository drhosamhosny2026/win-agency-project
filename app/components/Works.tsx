"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content, getClientById, getMediaById } from "@/lib/content";
import VideoModal from "./VideoModal";

gsap.registerPlugin(ScrollTrigger);

type ActiveVideo = { youtubeId: string; title: string };

export default function Works() {
  const [activeVideo, setActiveVideo] = useState<ActiveVideo | null>(null);

  const sectionRef      = useRef<HTMLElement>(null);
  const eyebrowRef      = useRef<HTMLParagraphElement>(null);
  const headingRef      = useRef<HTMLHeadingElement>(null);
  const featuredRef     = useRef<HTMLDivElement>(null);
  const archiveLabelRef = useRef<HTMLParagraphElement>(null);
  const archiveRef      = useRef<HTMLDivElement>(null);

  const featuredItems = content.work.items.filter((w) => w.featured);
  const archiveItems  = content.work.items.filter((w) => !w.featured);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Eyebrow label
      gsap.from(eyebrowRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
      });

      // Section heading
      gsap.from(headingRef.current, {
        y: 56,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });

      // Featured work items — each article fades up individually
      if (featuredRef.current) {
        gsap.from(featuredRef.current.querySelectorAll("article"), {
          y: 64,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.15,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 80%",
          },
        });
      }

      // "More Work" label
      if (archiveLabelRef.current) {
        gsap.from(archiveLabelRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: archiveLabelRef.current, start: "top 85%" },
        });
      }

      // Archive grid — softer, faster stagger
      if (archiveRef.current) {
        gsap.from(archiveRef.current.querySelectorAll("article"), {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: "power2.out",
          stagger: 0.08,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: archiveRef.current,
            start: "top 82%",
          },
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
    const client = work.clientId ? getClientById(work.clientId) : null;

    const primaryMedia = work.mediaIds[0]
      ? getMediaById(work.mediaIds[0])
      : null;

    const title =
      "displayTitle" in work && work.displayTitle
        ? (work.displayTitle as { en: string }).en
        : (work.title as { en: string }).en;

    let cover =
      work.id === "work-eid-song"
        ? "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1600&auto=format&fit=crop"
        : `${work.assetsPath}/cover.jpg`;

    let youtubeId: string | null = null;
    let mediaUrl: string | null = null;

    if (primaryMedia?.platform === "youtube" && primaryMedia.youtubeId) {
      youtubeId = primaryMedia.youtubeId;
      mediaUrl = primaryMedia.url;
      cover = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }

    if (primaryMedia?.platform === "instagram") {
      mediaUrl = primaryMedia.url;
    }

    const handleMediaClick = () => {
      if (youtubeId) {
        setActiveVideo({ youtubeId, title });
      } else if (mediaUrl) {
        window.open(mediaUrl, "_blank");
      }
    };

    if (isFeatured) {
      return (
        <article key={work.id} className={`featured-work-${idx} group`}>
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#f5f2ed] mb-8 md:mb-10">
            <div className="relative aspect-video md:aspect-[16/9] lg:h-[70vh] overflow-hidden">
              <Image
                fill
                unoptimized
                src={cover}
                alt={title}
                sizes="(max-width: 768px) 100vw, 90vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.background = "#E8E5E0";
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            {mediaUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-colors duration-500">
                <button
                  type="button"
                  onClick={handleMediaClick}
                  aria-label={`Play ${title}`}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/0 group-hover:bg-white text-transparent group-hover:text-black scale-75 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                >
                  <svg aria-hidden="true" className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
            <div className="flex-1">
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight mb-3">
                {title}
              </h3>
              <p className="text-sm md:text-base uppercase tracking-widest text-[#C6A77D]">
                {work.categories.join(" · ")}
              </p>
            </div>

            {client && (
              <div className="text-left md:text-right">
                <p className="text-base md:text-lg text-black/60 mb-2">{client.name}</p>
                {primaryMedia && primaryMedia.platform !== "youtube" && (
                  <a
                    href={primaryMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs md:text-sm font-medium text-[#C6A77D] hover:text-black transition-colors duration-300"
                  >
                    View on {primaryMedia.platform}
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
        <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-[#f5f2ed] mb-4 md:mb-6">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              fill
              unoptimized
              src={cover}
              alt={title}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.style.background = "#E8E5E0";
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          {mediaUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/25 transition-colors duration-500">
              <button
                type="button"
                onClick={handleMediaClick}
                aria-label={`Play ${title}`}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/0 group-hover:bg-white text-transparent group-hover:text-black scale-75 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              >
                <svg aria-hidden="true" className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-lg md:text-xl font-bold mb-2">{title}</h4>
          <p className="text-xs uppercase tracking-widest text-[#C6A77D] mb-2">
            {work.categories.join(" · ")}
          </p>
          {client && <p className="text-sm text-black/60">{client.name}</p>}
          {primaryMedia && primaryMedia.platform !== "youtube" && (
            <a
              href={primaryMedia.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-medium text-[#C6A77D] hover:text-black transition-colors duration-300 mt-2"
            >
              View on {primaryMedia.platform}
            </a>
          )}
        </div>
      </article>
    );
  };

  return (
    <>
      <section ref={sectionRef} id="works" className="bg-white py-24 md:py-32 px-8 md:px-16">
        <p ref={eyebrowRef} className="uppercase tracking-[0.3em] text-sm text-[#C6A77D] mb-6">
          {content.work.sectionTitle.en}
        </p>

        <h2 ref={headingRef} className="text-5xl md:text-7xl font-black mb-20 max-w-4xl">
          Previous Work
        </h2>

        {featuredItems.length > 0 && (
          <div ref={featuredRef} className="flex flex-col gap-20 md:gap-28 mb-24 md:mb-36">
            {featuredItems.map((work, idx) => renderWorkCard(work, idx, true))}
          </div>
        )}

        {archiveItems.length > 0 && (
          <>
            <p ref={archiveLabelRef} className="uppercase tracking-[0.3em] text-sm text-black/40 mb-10">
              More Work
            </p>
            <div ref={archiveRef} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
              {archiveItems.map((work, idx) => renderWorkCard(work, idx, false))}
            </div>
          </>
        )}
      </section>

      {activeVideo && (
        <VideoModal
          youtubeId={activeVideo.youtubeId}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </>
  );
}
