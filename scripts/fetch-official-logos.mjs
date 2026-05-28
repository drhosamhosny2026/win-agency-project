/**
 * Download official brand logos (SVG preferred) into public/assets/clients/{slug}/
 * Updates content/clients/logo-map.json then run sync-logo-manifest.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const clientsDir = path.join(root, "public/assets/clients");
const sourcesPath = path.join(root, "content/clients/logo-sources.json");
const displayOrder = JSON.parse(
  fs.readFileSync(path.join(root, "content/clients/manifest.json"), "utf8")
).displayOrder;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function resolveCommonsUrl(fileTitle) {
  await sleep(1200);
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.searchParams.set("action", "query");
  api.searchParams.set("titles", fileTitle);
  api.searchParams.set("prop", "imageinfo");
  api.searchParams.set("iiprop", "url");
  api.searchParams.set("format", "json");
  const res = await fetch(api, {
    headers: { "User-Agent": "WIN-Agency/1.0 (brand logo setup; local dev)" },
  });
  const json = await res.json();
  const page = Object.values(json.query?.pages ?? {})[0];
  if (page?.missing !== undefined) return null;
  return page?.imageinfo?.[0]?.url ?? null;
}

async function download(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "WIN-Agency/1.0 (brand logo setup; local dev)",
      Accept: "image/svg+xml,image/png,image/*,*/*",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const head = buf.slice(0, 200).toString("utf8").toLowerCase();
  if (head.includes("<!doctype html") || head.includes("<html"))
    throw new Error("Received HTML");
  return buf;
}

function commonsFilePathUrl(fileTitle) {
  const name = fileTitle.replace(/^File:/, "").replace(/ /g, "_");
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}`;
}

async function resolveSource(entry) {
  if (entry.directUrl) return entry.directUrl;
  if (entry.commonsFile) {
    const u = await resolveCommonsUrl(entry.commonsFile);
    if (u) return u;
  }
  if (entry.fallbackCommons) {
    const u = await resolveCommonsUrl(entry.fallbackCommons);
    if (u) return u;
  }
  if (entry.commonsFile) return commonsFilePathUrl(entry.commonsFile);
  throw new Error("No URL resolved");
}

function isSvg(buffer, entry) {
  if (entry.format === "png") return false;
  if (entry.format === "svg") return true;
  const head = buffer.slice(0, 500).toString("utf8").toLowerCase();
  return head.includes("<svg");
}

async function getDimensions(buffer, asSvg) {
  if (asSvg) {
    const m = await sharp(buffer, { density: 300 }).metadata();
    return { width: m.width ?? 200, height: m.height ?? 80 };
  }
  const m = await sharp(buffer).metadata();
  return { width: m.width ?? 200, height: m.height ?? 80 };
}

async function optimizePng(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const si = i * 4;
    const oi = i * 4;
    out[oi] = data[si];
    out[oi + 1] = data[si + 1];
    out[oi + 2] = data[si + 2];
    const lum = 0.299 * data[si] + 0.587 * data[si + 1] + 0.114 * data[si + 2];
    const a = data[si + 3];
    out[oi + 3] = lum > 252 && a > 200 ? 0 : a;
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 12 })
    .png({ compressionLevel: 9 })
    .resize({ width: 480, withoutEnlargement: true })
    .toBuffer();
}

async function main() {
  const { items: sources } = JSON.parse(fs.readFileSync(sourcesPath, "utf8"));
  const mapping = [];
  const failures = [];

  for (const entry of sources) {
    const dir = path.join(clientsDir, entry.id);
    fs.mkdirSync(dir, { recursive: true });

    try {
      const url = await resolveSource(entry);
      let buffer = await download(url);
      const svg = isSvg(buffer, entry);

      if (svg) {
        fs.writeFileSync(path.join(dir, "logo.svg"), buffer);
        const pngLegacy = path.join(dir, "logo.png");
        if (fs.existsSync(pngLegacy)) fs.unlinkSync(pngLegacy);
      } else {
        buffer = await optimizePng(buffer);
        fs.writeFileSync(path.join(dir, "logo.png"), buffer);
        const svgLegacy = path.join(dir, "logo.svg");
        if (fs.existsSync(svgLegacy)) fs.unlinkSync(svgLegacy);
      }

      const dims = await getDimensions(
        svg ? fs.readFileSync(path.join(dir, "logo.svg")) : buffer,
        svg
      );
      const displayHeight = 80;
      const displayWidth = Math.round(displayHeight * (dims.width / dims.height));

      const logoPath = `/assets/clients/${entry.id}/${svg ? "logo.svg" : "logo.png"}`;
      mapping.push({
        id: entry.id,
        name: entry.name,
        logo: logoPath,
        format: svg ? "svg" : "png",
        width: displayWidth,
        height: displayHeight,
        intrinsicWidth: dims.width,
        intrinsicHeight: dims.height,
        source: url,
      });
      console.log(`✓ ${entry.id} → ${svg ? "logo.svg" : "logo.png"}`);
    } catch (e) {
      failures.push({ id: entry.id, error: e.message });
      console.error(`✗ ${entry.id}: ${e.message}`);
    }
  }

  const ordered = displayOrder
    .map((id) => mapping.find((m) => m.id === id))
    .filter(Boolean);

  fs.writeFileSync(
    path.join(root, "content/clients/logo-map.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: "official-web-assets",
        displayOrder,
        items: ordered,
      },
      null,
      2
    )
  );

  if (failures.length) {
    console.error("\nFailures:", failures);
    process.exit(1);
  }

  const { spawnSync } = await import("node:child_process");
  spawnSync("node", ["scripts/sync-logo-manifest.mjs"], { cwd: root, stdio: "inherit" });
}

main();
