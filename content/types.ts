/** Canonical content model — mirrors win-agency-file.pdf (Company Profile 2026) */

export type LocaleBlock = { en: string; ar?: string };

export type MediaPlatform =
  | "youtube"
  | "instagram"
  | "x"
  | "linkedin"
  | "image"
  | "video-file";

export type MediaLink = {
  id: string;
  platform: MediaPlatform;
  url: string;
  label?: string;
  youtubeId?: string;
  pdfPage?: number;
};

export type WorkCategory =
  | "campaign"
  | "event"
  | "music"
  | "sponsorship"
  | "marketing"
  | "award-feature";

export type ClientRef = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  sources: Array<"clients-slide" | "portfolio" | "award">;
  pdfPages?: number[];
};

export type WorkSlide = {
  pdfPage: number;
  assetKey: string;
  notes?: string;
};

export type WorkItem = {
  id: string;
  title: string;
  titleAr?: string;
  subtitle?: string;
  clientId: string | null;
  partnerIds?: string[];
  category: WorkCategory;
  categories: WorkCategory[];
  serviceTags: string[];
  pdfPages: number[];
  slides: WorkSlide[];
  mediaIds: string[];
  featured: boolean;
  assetsPath: string;
  description?: LocaleBlock;
};

export type AwardItem = {
  id: string;
  title: LocaleBlock;
  year: number;
  clientId: string;
  category: string;
  categoryAr?: string;
  pdfPages: number[];
  description: LocaleBlock;
  mediaIds: string[];
  assetsPath: string;
  relatedWorkId?: string;
};

export type ServiceGroup = {
  id: string;
  title: LocaleBlock;
  items: LocaleBlock[];
  pdfPages: number[];
};

export type PdfPageEntry = {
  page: number;
  sectionId: string;
  title: string;
  notes?: string;
};

export type SiteContent = {
  agency: typeof import("./agency.json");
  contact: typeof import("./contact.json");
  narrative: typeof import("./narrative.json");
  services: typeof import("./services.json");
  categories: typeof import("./categories.json");
  clients: typeof import("./clients/manifest.json");
  awards: typeof import("./awards/manifest.json");
  work: typeof import("./work/manifest.json");
  media: typeof import("./media/registry.json");
  pdf: typeof import("./pdf/page-map.json");
  site: typeof import("./site/sections.json");
};
