# WIN Agency — Asset Library

Maps 1:1 to `content/` (Company Profile 2026). **Nothing omitted.**

## Tree

```
public/assets/
├── brand/                    WIN logo, wordmark, favicon
├── hero/                     Homepage reel (replace placeholder video)
├── pdf/                      Optional full-page exports (page-01.jpg … page-28.jpg)
├── clients/                  13 logos from PDF page 9
│   └── {slug}/logo.svg | logo.png
├── partners/
│   └── falcons/              Sign x Falcons
├── awards/
│   └── media-excellence-2024/
└── projects/                 10 portfolio case studies
    └── {slug}/
        ├── cover.jpg
        ├── thumb.jpg
        └── gallery/
            ├── slide-01.jpg   (match PDF slide assetKey)
            └── …
```

## Client slugs (page 9 — all required)

`kafd` · `neom` · `mbc` · `gea` · `rega` · `half-million` · `jahez` · `tawuniya` · `mahally` · `mos` · `cardinal` · `mdlbeast` · `riyadh-season`

## Project slugs

| Slug | PDF pages | Media |
|------|-----------|--------|
| `saudi-national-day-half-million` | 12–13 | YouTube |
| `kafd-concert` | 14–16 | YouTube |
| `eid-song` | 17 | Instagram |
| `sonic-branding-half-million` | 18 | YouTube |
| `saudi-national-day-rega` | 19 | YouTube |
| `saudi-national-day-mos` | 20 | YouTube + X |
| `advertising-campaign` | 21–23 | YouTube |
| `sign-x-falcons` | 24 | — |
| `event-gea` | 25 | X |
| `event-half-million` | 26 | LinkedIn |

## Award

`awards/media-excellence-2024/` — PDF page 11

## Data source

`content/media/registry.json` — all YouTube & social URLs.
