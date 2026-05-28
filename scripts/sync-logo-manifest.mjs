/** Sync logo-map.json dimensions into clients/manifest.json and portfolio.json */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const logoMap = JSON.parse(
  fs.readFileSync(path.join(root, "content/clients/logo-map.json"), "utf8")
);
const manifestPath = path.join(root, "content/clients/manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

for (const item of manifest.items) {
  const logo = logoMap.items.find((l) => l.id === item.id);
  if (!logo) continue;
  item.logo = logo.logo;
  item.logoFallback = logo.logo;
  item.logoWidth = logo.width;
  item.logoHeight = logo.height;
  item.pdfPages = [9];
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

const portfolioPath = path.join(root, "content/portfolio.json");
const portfolio = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));
portfolio.clientLogos = {
  pdfPage: logoMap.pdfPage,
  displayOrder: logoMap.displayOrder,
  items: manifest.items.map((c) => {
    const l = logoMap.items.find((x) => x.id === c.id);
    return {
      id: c.id,
      name: c.name,
      logo: l.logo,
      width: l.width,
      height: l.height,
    };
  }),
};
portfolio.clientLogos.generatedAt = logoMap.generatedAt;
fs.writeFileSync(portfolioPath, JSON.stringify(portfolio, null, 2) + "\n");
console.log("Synced manifest + portfolio");
