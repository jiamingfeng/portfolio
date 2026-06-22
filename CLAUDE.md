# CLAUDE.md — Eric Feng portfolio

Project memory for AI sessions. Human-facing docs: [README.md](README.md) (setup/deploy)
and [CONTENT.md](CONTENT.md) (how to update materials, add projects, cut sizzle reels).

## What this is

A dark, cinematic single-page portfolio for a Principal/Lead game-engine & graphics
engineer, job-hunting. Built with **Astro** (static output), deployed to **GitHub
Pages** via GitHub Actions. No runtime JS framework.

## Architecture — data-driven by design

The defining decision: **all content lives in two data files**, so updating the site
means editing data, not components.

- [`src/data/projects.ts`](src/data/projects.ts) — the project showcase. One `Project`
  entry per project; `media[]` holds ordered items, each either
  `{type:'youtube', id, title}` or `{type:'loop', src, poster, title}`. First media
  item renders featured (large); rest render in a 2-up grid. Empty `media` → text-only
  card (used for NDA work). **Adding a project = one array entry + optional asset
  folder.** Display order = array order.
- [`src/data/site.ts`](src/data/site.ts) — `site` (identity/SEO), `contact`, `skills`,
  `timeline`.

Components (`src/components/*.astro`) are presentational and iterate over the data:
`Nav`, `Hero`, `ProjectSection` (renders one project + its media), `YouTubeEmbed`
(lazy facade — poster thumbnail, injects iframe only on click, uses youtube-nocookie),
`VideoLoop` (muted/loop/playsinline `<video>` with webm+mp4 sources, plays only while
on-screen via IntersectionObserver), `About` (timeline + skills), `Contact`, `Footer`.
`src/layouts/Base.astro` holds `<head>`, Google Fonts (Inter + JetBrains Mono), OG tags,
and the scroll-reveal IntersectionObserver. `src/styles/global.css` has the design
tokens (CSS custom properties; cyan accent `--accent`).

## Media pipeline

GitHub Pages limits: 100 MB/file hard, ~1 GB repo soft. So:

- **Online / large videos → YouTube embeds** (never hosted). Includes the 128 MB Pharos
  spotlight and official Towerborne Xbox footage (`officialFootage: true` shows a badge —
  that footage is studio marketing, not personal capture).
- **Short clips → in-repo silent loops.** [`scripts/convert-media.sh`](scripts/convert-media.sh)
  runs ffmpeg (`/c/Tools/ffmpeg/bin/ffmpeg.exe`, v4.0.2) over curated source clips →
  `<name>.mp4` (H.264) + `<name>.webm` (VP9) + `<name>-poster.jpg`, written to
  `public/assets/<slug>/`. Re-runnable; overwrites outputs. 1280px wide, silent.

Raw source folders (`LEGO_BRICK_EDITOR/`, `Exodus/`, `Childish Gambino's Pharos/`) are
**git-ignored** — originals kept locally, only converted copies in `public/assets/` are
committed. `resume.pdf` is copied to `public/resume.pdf` (served at `/resume.pdf`).

## Commands

```bash
npm install              # deps
npm run dev              # dev server, http://localhost:4321
npm run build            # static build → dist/
npm run preview          # preview dist/
bash scripts/convert-media.sh   # (re)generate in-repo video loops
```

## Deploy

`.github/workflows/deploy.yml`: on push to `main` → `npm ci` + `npm run build` →
upload `dist/` → deploy to Pages. **GitHub setup is one-time**: create repo, push,
Settings → Pages → Source: **GitHub Actions**. URL config (`USERNAME`/`REPO`) is at the
top of [`astro.config.mjs`](astro.config.mjs) — currently a project page at
`https://jiamingfeng.github.io/portfolio` (`base: '/portfolio'`). For a user page
(`<user>.github.io` repo), set `base: '/'`.

## Conventions / gotchas

- All internal asset URLs must respect `import.meta.env.BASE_URL` (because of the
  `/portfolio` base path). Components already do this — follow the pattern when adding
  links to anything in `public/`.
- `media` item `src`/`poster` are base names **without extension**; `VideoLoop` appends
  `.webm`/`.mp4`/`.jpg` and prepends `assets/<slug>/`.
- Inter font weight names matter if ever used in Figma/elsewhere: "Semi Bold", not
  "SemiBold".
- Respect `prefers-reduced-motion` — already handled in global.css / components.

## Current project set (order)

LEGO Brick Editor → Exodus → Towerborne → CoD: MWIII → Pharos → Atlas → Frostbite.
Media: LEGO (`7J7J0zm5xFc`, `OQhOTe790kY`), Exodus (`ye14LA-FJnY` + 6 local loops),
Towerborne official (`4RhVFeNIBi0`, `YQlDe-tBV4E`, `7bY1Hgia6_I`), Pharos
(`DTAW0i7NSoo`), Atlas (`e8DUEO_Sr7Y`); CoD & Frostbite text-only.

Spec: [docs/superpowers/specs/2026-06-22-portfolio-website-design.md](docs/superpowers/specs/2026-06-22-portfolio-website-design.md).
