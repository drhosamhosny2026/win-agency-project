import fs from "node:fs";

const pdfPath = process.argv[2] ?? "c:/Users/g/Desktop/win-agency-file.pdf";
const raw = fs.readFileSync(pdfPath);
const text = raw.toString("latin1");

const pattern = /https?:\/\/[^\s\)<>\[\]{}\\]+/g;
const links = [];
let match;
while ((match = pattern.exec(text)) !== null) {
  const url = match[0];
  if (url.includes("w3.org") || url.includes("adobe.com") || url.includes("purl.org")) {
    continue;
  }
  links.push({ offset: match.index, url });
}

const seen = new Set();
const ordered = [];
for (const item of links.sort((a, b) => a.offset - b.offset)) {
  if (seen.has(item.url)) continue;
  seen.add(item.url);
  ordered.push(item.url);
}

console.log(JSON.stringify(ordered, null, 2));
