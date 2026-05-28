import agency from "@/content/agency.json";
import contact from "@/content/contact.json";
import narrative from "@/content/narrative.json";
import services from "@/content/services.json";
import categories from "@/content/categories.json";
import clientsManifest from "@/content/clients/manifest.json";
import portfolio from "@/content/portfolio.json";
import { CLIENT_LOGOS } from "@/lib/client-logos";
import awardsManifest from "@/content/awards/manifest.json";
import workManifest from "@/content/work/manifest.json";
import mediaRegistry from "@/content/media/registry.json";
import pdfPageMap from "@/content/pdf/page-map.json";
import siteSections from "@/content/site/sections.json";

export const content = {
  agency,
  contact,
  narrative,
  services,
  categories,
  clients: clientsManifest,
  portfolio,
  awards: awardsManifest,
  work: workManifest,
  media: mediaRegistry,
  pdf: pdfPageMap,
  site: siteSections,
} as const;

export type Content = typeof content;

export function getClientById(id: string) {
  return content.clients.items.find((c) => c.id === id);
}

export function getWorkById(id: string) {
  return content.work.items.find((w) => w.id === id);
}

export function getMediaById(id: string) {
  return content.media.items.find((m) => m.id === id);
}

export function getWorkWithMedia(workId: string) {
  const work = getWorkById(workId);
  if (!work) return null;
  const media = work.mediaIds
    .map((id) => getMediaById(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  const client = work.clientId ? getClientById(work.clientId) : null;
  return { work, media, client };
}

export function getAllYouTubeLinks() {
  return content.media.youtubeAll;
}

export { CLIENT_LOGOS, getClientLogo, getClientLogoBySlug } from "@/lib/client-logos";

export function getClientLogosForMarquee() {
  if (CLIENT_LOGOS.length) return CLIENT_LOGOS;
  return content.portfolio.clientLogos.items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.id,
    logo: item.logo,
    width: item.width,
    height: item.height,
    alt: `${item.name} logo`,
  }));
}
