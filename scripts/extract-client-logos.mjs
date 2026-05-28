/**
 * Extract all client logos from PDF page 9.
 * Splits wide composite strips into individual logos; optimizes to transparent PNG.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const pdfPath = process.argv[2] ?? "c:/Users/g/Desktop/win-agency-file.pdf";
const clientsPage = 9;

const displayOrder = [
  "kafd",
  "neom",
  "mbc",
  "gea",
  "rega",
  "half-million",
  "jahez",
  "tawuniya",
  "mahally",
  "mos",
  "cardinal",
  "mdlbeast",
  "riyadh-season",
];

async function getPageImages(pdfjs, pdfBuffer, pageNumber) {
  const pdf = await pdfjs
    .getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
      disableFontFace: true,
    })
    .promise;
  const page = await pdf.getPage(pageNumber);
  const ops = await page.getOperatorList();
  const objs = page.objs;
  const seen = new Set();
  const images = [];

  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];
    if (fn !== 85 && fn !== 86) continue;
    const name = ops.argsArray[i][0];
    if (seen.has(name)) continue;
    seen.add(name);
    try {
      const img = await objs.get(name);
      if (!img?.data || !img.width || !img.height) continue;
      const channels = img.kind === 2 ? 3 : img.kind === 3 ? 4 : 1;
      images.push({
        name,
        order: i,
        width: img.width,
        height: img.height,
        data: Buffer.from(img.data),
        channels,
      });
    } catch {
      /* skip */
    }
  }

  return images.sort((a, b) => a.order - b.order);
}

function makeTransparent(data, width, height, channels) {
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const si = i * channels;
    const r = data[si];
    const g = data[si + 1] ?? r;
    const b = data[si + 2] ?? r;
    const oi = i * 4;
    out[oi] = r;
    out[oi + 1] = g;
    out[oi + 2] = b;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;
    // Only key out near-white PDF paper — preserve black/dark brand marks
    if (lum > 248 && sat < 0.15) {
      out[oi + 3] = 0;
    } else if (lum > 235 && sat < 0.1) {
      out[oi + 3] = Math.max(0, 255 - (lum - 228) * 20);
    } else {
      out[oi + 3] = channels === 4 ? (data[si + 3] ?? 255) : 255;
    }
  }
  return out;
}

async function toOptimizedPng(buffer, width, height, channels) {
  const rgba =
    channels === 4 ? buffer : makeTransparent(buffer, width, height, channels);
  return sharp(rgba, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 12 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .resize({ width: 420, withoutEnlargement: true })
    .toBuffer();
}

/** Split a horizontal logo strip using column density valleys */
async function splitLogoStrip(buffer, width, height, channels, parts) {
  const rgba =
    channels === 4 ? buffer : makeTransparent(buffer, width, height, channels);
  const { data, info } = await sharp(rgba, {
    raw: { width, height, channels: 4 },
  })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const colDensity = new Float32Array(info.width);
  for (let x = 0; x < info.width; x++) {
    let sum = 0;
    for (let y = 0; y < info.height; y++) {
      const a = data[(y * info.width + x) * 4 + 3];
      if (a > 24) sum++;
    }
    colDensity[x] = sum;
  }

  const sliceWidth = Math.floor(info.width / parts);
  const slices = [];
  for (let p = 0; p < parts; p++) {
    let left = p * sliceWidth;
    let right = p === parts - 1 ? info.width : (p + 1) * sliceWidth;

    // Refine bounds: shrink to content in slice
    let l = left;
    let r = right;
    while (l < r && colDensity[l] < 2) l++;
    while (r > l && colDensity[r - 1] < 2) r--;
    if (r - l < 20) {
      l = left;
      r = right;
    }

    const sw = r - l;
    const sh = info.height;
    const slice = Buffer.alloc(sw * sh * 4);
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        const si = (y * info.width + (l + x)) * 4;
        const di = (y * sw + x) * 4;
        slice[di] = data[si];
        slice[di + 1] = data[si + 1];
        slice[di + 2] = data[si + 2];
        slice[di + 3] = data[si + 3];
      }
    }
    slices.push({ buffer: slice, width: sw, height: sh });
  }
  return slices;
}

function isBackgroundTile(img) {
  // Full-page watermark tile repeated on spread
  return img.width === 168 && img.height === 300;
}

function isLogoStrip(img) {
  return img.width > 700 && img.height < 320 && img.width / img.height > 2.5;
}

function isSplitCandidate(img) {
  return img.width >= 480 && img.width <= 600 && img.height >= 140;
}

async function buildLogoList(pageImages) {
  const logos = [];
  for (const img of pageImages) {
    if (isBackgroundTile(img)) continue;

    if (isLogoStrip(img)) {
      const remaining = displayOrder.length - logos.length;
      const parts = Math.min(7, remaining);
      const slices = await splitLogoStrip(
        img.data,
        img.width,
        img.height,
        img.channels,
        parts
      );
      for (const s of slices) logos.push(s);
      continue;
    }

    if (isSplitCandidate(img) && logos.length === 7) {
      const slices = await splitLogoStrip(
        img.data,
        img.width,
        img.height,
        img.channels,
        2
      );
      for (const s of slices) logos.push(s);
      continue;
    }

    if (img.width >= 200 && img.height >= 80) {
      logos.push({
        buffer: img.data,
        width: img.width,
        height: img.height,
        channels: img.channels,
      });
    }
  }
  return logos;
}

async function main() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pageImages = await getPageImages(pdfjs, pdfBuffer, clientsPage);

  console.log(
    `Page ${clientsPage}: ${pageImages.length} XObjects`,
    pageImages.map((i) => `${i.name} ${i.width}x${i.height}`).join(", ")
  );

  const logos = await buildLogoList(pageImages);
  console.log(`Resolved ${logos.length} logo raster(s)`);

  if (logos.length < displayOrder.length) {
    console.warn(
      `Expected ${displayOrder.length} logos, got ${logos.length}. Check PDF or displayOrder.`
    );
  }

  const outDir = path.join(root, "public/assets/clients");
  const mapping = [];

  for (let i = 0; i < displayOrder.length; i++) {
    const slug = displayOrder[i];
    const clientDir = path.join(outDir, slug);
    fs.mkdirSync(clientDir, { recursive: true });
    const outFile = path.join(clientDir, "logo.png");
    const src = logos[i];

    if (!src) {
      console.warn(`No raster for ${slug}`);
      continue;
    }

    const channels = src.channels ?? 4;
    const w = src.width;
    const h = src.height;
    const buf = src.buffer;
    const optimized = await toOptimizedPng(buf, w, h, channels);
    fs.writeFileSync(outFile, optimized);
    const meta = await sharp(optimized).metadata();

    mapping.push({
      id: slug,
      logo: `/assets/clients/${slug}/logo.png`,
      width: meta.width,
      height: meta.height,
    });
    console.log(`✓ ${slug} → ${meta.width}x${meta.height}`);
  }

  const mapPath = path.join(root, "content/clients/logo-map.json");
  fs.writeFileSync(
    mapPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        pdfPage: clientsPage,
        displayOrder,
        items: mapping,
      },
      null,
      2
    )
  );
  console.log("Wrote", mapPath);

  const { spawnSync } = await import("node:child_process");
  spawnSync("node", ["scripts/sync-logo-manifest.mjs"], {
    cwd: root,
    stdio: "inherit",
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
