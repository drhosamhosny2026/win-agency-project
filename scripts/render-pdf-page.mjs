import fs from "node:fs";
import { createCanvas } from "canvas";
import path from "node:path";
import { fileURLToPath } from "node:url";

const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
const pdfPath = process.argv[2] ?? "c:/Users/g/Desktop/win-agency-file.pdf";
const pageNum = Number(process.argv[3] ?? 9);
const scale = Number(process.argv[4] ?? 3);

const data = new Uint8Array(fs.readFileSync(pdfPath));
const pdf = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
const page = await pdf.getPage(pageNum);
const viewport = page.getViewport({ scale });
const canvas = createCanvas(viewport.width, viewport.height);
const ctx = canvas.getContext("2d");
await page.render({ canvasContext: ctx, viewport }).promise;
const out = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  `../public/assets/clients/_debug-page-${String(pageNum).padStart(2, "0")}-canvas.png`
);
fs.writeFileSync(out, canvas.toBuffer("image/png"));
console.log("Wrote", out, viewport.width, "x", viewport.height);
