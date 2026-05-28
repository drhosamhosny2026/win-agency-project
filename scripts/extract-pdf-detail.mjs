import fs from "node:fs";

const pdfPath = process.argv[2] ?? "c:/Users/g/Desktop/win-agency-file.pdf";
const raw = fs.readFileSync(pdfPath);
const text = raw.toString("latin1");

// Page markers in extracted text often appear as "-- N of 28 --"
const pageMarkers = [...text.matchAll(/-- (\d+) of 28 --/g)].map((m) => ({
  page: Number(m[1]),
  offset: m.index,
}));

function pageAtOffset(offset) {
  let page = 1;
  for (const m of pageMarkers) {
    if (m.offset <= offset) page = m.page;
    else break;
  }
  return page;
}

const urlPattern = /https?:\/\/[^\s\)<>\[\]{}\\]+/g;
const links = [];
let match;
while ((match = urlPattern.exec(text)) !== null) {
  const url = match[0];
  if (/w3\.org|adobe\.com|purl\.org/.test(url)) continue;
  links.push({ page: pageAtOffset(match.index), url });
}

// Image XObject names (often logo filenames embedded)
const images = [...text.matchAll(/\/([A-Za-z0-9_-]+\.(?:png|jpg|jpeg|svg|webp))/gi)].map(
  (m) => m[1]
);

console.log(
  JSON.stringify(
    {
      pageCount: 28,
      pageMarkers: pageMarkers.length,
      links,
      uniqueImages: [...new Set(images)].slice(0, 50),
    },
    null,
    2
  )
);
