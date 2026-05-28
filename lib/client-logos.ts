import clientsManifest from "@/content/clients/manifest.json";
import logoMap from "@/content/clients/logo-map.json";

export type ClientLogoEntry = {
  id: string;
  name: string;
  slug: string;
  logo: string;
  width: number;
  height: number;
  alt: string;
};

/** Raster logos extracted from PDF page 9 → public/assets/clients/{slug}/logo.png */
const logoById = new Map(
  logoMap.items.map((item) => [item.id, item] as const)
);

function buildEntry(
  client: (typeof clientsManifest.items)[number]
): ClientLogoEntry {
  const asset = logoById.get(client.id);
  const logo = asset?.logo ?? `/assets/clients/${client.slug}/logo.png`;
  const width = asset?.width ?? 200;
  const height = asset?.height ?? 80;

  return {
    id: client.id,
    name: client.name,
    slug: client.slug,
    logo,
    width,
    height,
    alt: `${client.name} logo`,
  };
}

/** Ordered client logos for marquee / grids (matches PDF logo grid order). */
export const CLIENT_LOGOS: ClientLogoEntry[] = clientsManifest.displayOrder
  .map((id) => clientsManifest.items.find((c) => c.id === id))
  .filter((c): c is (typeof clientsManifest.items)[number] => Boolean(c))
  .map(buildEntry);

export const CLIENT_LOGO_BY_ID: Record<string, ClientLogoEntry> =
  Object.fromEntries(CLIENT_LOGOS.map((entry) => [entry.id, entry]));

export function getClientLogo(clientId: string): ClientLogoEntry | undefined {
  return CLIENT_LOGO_BY_ID[clientId];
}

export function getClientLogoBySlug(slug: string): ClientLogoEntry | undefined {
  return CLIENT_LOGOS.find((c) => c.slug === slug);
}
