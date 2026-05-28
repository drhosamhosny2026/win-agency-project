/**
 * fix-logos.mjs
 * Fixes broken client logos:
 * 1. Inverts white-on-transparent PNGs (KAFD, REGA) → black-on-transparent
 * 2. Crops the Jahez SVG viewBox to remove the massive whitespace (was 1000×1000, content is ~3:1)
 * 3. Rebuilds logo-map.json with all 13 logos and correct aspect ratios
 * 4. Runs sync-logo-manifest.mjs to propagate to manifest.json + portfolio.json
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const clientsDir = path.join(root, "public/assets/clients");

// ─── 1. Invert white-on-transparent PNG logos ────────────────────────────────

async function invertPng(slug) {
  const file = path.join(clientsDir, slug, "logo.png");
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < info.width * info.height; i++) {
    const s = i * 4;
    out[s]     = 255 - data[s];      // invert R
    out[s + 1] = 255 - data[s + 1]; // invert G
    out[s + 2] = 255 - data[s + 2]; // invert B
    out[s + 3] = data[s + 3];       // preserve alpha
  }

  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(file);

  console.log(`✓ Inverted ${slug}/logo.png (${info.width}×${info.height})`);
}

// ─── 2. Fix Jahez SVG viewBox ────────────────────────────────────────────────
// Content X range: ~137–863, Y range: ~360–635. Add padding → viewBox below.
// New aspect ratio: 800/275 = 2.909:1

function fixJahezViewBox() {
  const file = path.join(clientsDir, "jahez", "logo.svg");
  let svg = fs.readFileSync(file, "utf8");

  // Replace the square viewBox with one cropped to actual content + padding
  svg = svg.replace(
    /viewBox="0 0 1000 1000"/,
    'viewBox="100 360 800 275"'
  );

  // Also fix the style hint to match
  svg = svg.replace(
    /enable-background:new 0 0 1000 1000/,
    "enable-background:new 100 360 800 275"
  );

  fs.writeFileSync(file, svg, "utf8");
  console.log("✓ Fixed jahez/logo.svg viewBox → 100 360 800 275 (aspect 2.91:1)");
}

// ─── 3. Read actual dimensions for each logo ─────────────────────────────────

async function getDims(slug) {
  const svgPath = path.join(clientsDir, slug, "logo.svg");
  const pngPath = path.join(clientsDir, slug, "logo.png");

  if (fs.existsSync(svgPath)) {
    // Read viewBox from SVG to get true intrinsic aspect ratio
    const content = fs.readFileSync(svgPath, "utf8");
    const vbMatch = content.match(/viewBox="([^"]+)"/);
    if (vbMatch) {
      const parts = vbMatch[1].trim().split(/[\s,]+/).map(Number);
      if (parts.length === 4) {
        const [, , w, h] = parts;
        return { w, h, file: svgPath, format: "svg" };
      }
    }
    // Fallback: render and measure
    const meta = await sharp(svgPath, { density: 144 }).metadata();
    return { w: meta.width, h: meta.height, file: svgPath, format: "svg" };
  }

  const meta = await sharp(pngPath).metadata();
  return { w: meta.width, h: meta.height, file: pngPath, format: "png" };
}

// ─── 4. Build complete logo-map.json ─────────────────────────────────────────

const DISPLAY_H = 80; // normalised display height for the map

const DISPLAY_ORDER = [
  "kafd", "neom", "mbc", "gea", "rega", "half-million",
  "jahez", "tawuniya", "mahally", "mos", "cardinal", "mdlbeast", "riyadh-season",
];

async function buildLogoMap() {
  // Read the existing map (has extra metadata for fetched logos)
  const mapPath = path.join(root, "content/clients/logo-map.json");
  const existingMap = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  const byId = new Map(existingMap.items.map((x) => [x.id, x]));

  const items = [];

  for (const slug of DISPLAY_ORDER) {
    const dims = await getDims(slug);
    const aspect = dims.w / dims.h;
    const displayWidth = Math.round(DISPLAY_H * aspect);
    const logoPath = `/assets/clients/${slug}/${dims.format === "svg" ? "logo.svg" : "logo.png"}`;

    const existing = byId.get(slug);
    if (existing) {
      // Keep full metadata from fetch; update width/height for accuracy
      items.push({
        ...existing,
        logo: logoPath,
        width: displayWidth,
        height: DISPLAY_H,
      });
    } else {
      items.push({
        id: slug,
        logo: logoPath,
        format: dims.format,
        width: displayWidth,
        height: DISPLAY_H,
        intrinsicWidth: dims.w,
        intrinsicHeight: dims.h,
      });
    }

    console.log(`  ${slug}: ${dims.w}×${dims.h} → display ${displayWidth}×${DISPLAY_H}`);
  }

  const newMap = {
    generatedAt: new Date().toISOString(),
    source: "mixed-official-and-extracted",
    displayOrder: DISPLAY_ORDER,
    items,
  };

  fs.writeFileSync(mapPath, JSON.stringify(newMap, null, 2) + "\n");
  console.log(`\n✓ Wrote ${mapPath} (${items.length} entries)`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("── Step 1: Invert white PNGs ─────────────────────────────────");
  await invertPng("kafd");
  await invertPng("rega");

  console.log("\n── Step 2: Fix Jahez viewBox ──────────────────────────────────");
  fixJahezViewBox();

  console.log("\n── Step 3: Build logo-map.json ────────────────────────────────");
  await buildLogoMap();

  console.log("\n── Step 4: Sync manifest ──────────────────────────────────────");
  const result = spawnSync("node", ["scripts/sync-logo-manifest.mjs"], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.error("sync-logo-manifest.mjs failed");
    process.exit(1);
  }

  console.log("\n✅ Logo fix complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
