# WIN Agency — Content Architecture

Premium-ready, **zero-omission** content layer mapped 1:1 to `win-agency-file.pdf` (Company Profile 2026, 28 pages).

## Structure


| Path                    | Purpose                                                   |
| ----------------------- | --------------------------------------------------------- |
| `agency.json`           | Brand, tagline, about (EN/AR), founded year               |
| `contact.json`          | Location, email, phone, closing                           |
| `narrative.json`        | Objectives, vision, mission (EN/AR)                       |
| `services.json`         | All 4 service groups + bullet items (EN/AR)               |
| `categories.json`       | Work + service category taxonomy                          |
| `clients/manifest.json` | **13 client logos** (page 9) + portfolio/award cross-refs |
| `awards/manifest.json`  | Media Excellence Award 2024                               |
| `work/manifest.json`    | **10 portfolio projects** + Falcons partner               |
| `media/registry.json`   | **6 YouTube** + **4 social** links (10 total)             |
| `pdf/page-map.json`     | Every PDF page documented                                 |
| `site/sections.json`    | Homepage section order + PDF coverage map                 |


## Counts (audit)

- **Clients (logo grid):** 13
- **Portfolio projects:** 10
- **Awards:** 1
- **Partners:** 1 (Falcons — Sign x Falcons)
- **YouTube URLs:** 6
- **Instagram / X / LinkedIn:** 4
- **PDF pages mapped:** 28

## Usage

```ts
import { content, getWorkWithMedia, getClientLogosForMarquee } from "@/lib/content";

const work = getWorkWithMedia("work-kafd-concert");
const logos = getClientLogosForMarquee();
```

## Assets

Mirror paths under `public/assets/` — see `public/assets/README.md`.

## Re-extract links from PDF

```bash
node scripts/extract-pdf-urls.mjs "c:/Users/g/Desktop/win-agency-file.pdf"
```

