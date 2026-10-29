# CLAUDE.md — Eric Feng portfolio

Project memory for AI sessions. Human-facing docs: [README.md](README.md) (setup/deploy)
and [CONTENT.md](CONTENT.md) (how to update materials, add projects, cut sizzle reels).

## What this is

A dark, cinematic portfolio for a Principal/Lead game-engine & graphics engineer,
job-hunting. Built with **Astro** (static output), deployed to **GitHub Pages** via
GitHub Actions. No runtime JS framework.

**Two pages, two pitches, one set of components:**

| Page | Pitch | Audience |
|---|---|---|
| `/` ([index.astro](src/pages/index.astro)) | Principal / Lead Engineer · Unreal specialist | game-engine & graphics roles |
| `/xr` ([xr.astro](src/pages/xr.astro)) | Senior XR Software Engineer · AR / VR / MR | XR roles (Unity/OpenXR/headset work) |

They're cross-linked in the nav and differ *only* by the `Profile` they're handed.

## Architecture — data-driven by design

The defining decision: **all content lives in three data files**, so updating the site
means editing data, not components.

- [`src/data/projects.ts`](src/data/projects.ts) — the project catalogue. One `Project`
  entry per project; `media[]` holds ordered items, each either
  `{type:'youtube', id, title}`, `{type:'loop', src, poster, title}`,
  `{type:'image', src, title}` or `{type:'video', url, poster, title}`. First media
  item renders featured (large); rest render in a 2-up grid. Empty `media` → text-only
  card (used for NDA work). **Adding a project = one array entry + optional asset
  folder.** Display order = array order. Also exports:
  - `Tag` — a **closed union** of skill-tag strings rendered as pills under each
    project title. A typo is a build failure (see type checking below), which is the
    whole point: it stops near-duplicate tags like `C++` vs `C/C++`.
  - `projects` (front-page lineup) and `xrOnlyProjects` (entries that appear only on
    `/xr`, currently AR Scouting + Holoplayer).
  - `projectBySlug(slug, overrides)` — fetch a project with per-page copy overridden.
    Shallow-merges, so the slug (and therefore the `public/assets/<slug>/` folder) is
    shared rather than duplicated. Throws on an unknown slug.
- [`src/data/site.ts`](src/data/site.ts) — shared identity: `site` (identity/SEO),
  `contact`, `skills` (the single home for skill **levels**), `timeline`.
- [`src/data/profiles.ts`](src/data/profiles.ts) — one `Profile` per page, holding
  everything that differs between the two pitches: tagline, summary, SEO strings,
  section headings, contact pitch, skill *order*, timeline, project lineup, and the
  nav cross-link. `generalProfile` and `xrProfile`. **To change the XR page, edit
  `xrProfile`** — its `projects` array is a list of `projectBySlug()` calls, each with
  optional XR re-framing of `blurb`/`contributions`/`tags`.

Components (`src/components/*.astro`) are presentational and iterate over the data:
`Nav`, `Hero`, `ProjectSection` (one project + its tags + its media), `YouTubeEmbed`
(lazy facade — poster thumbnail, injects iframe only on click, uses youtube-nocookie),
`VideoLoop` (muted/loop/playsinline `<video>` with webm+mp4 sources, plays only while
on-screen via IntersectionObserver), `About` (timeline + skills), `Contact`, `Footer`.

`Nav`, `Hero`, `About` and `Contact` take an **optional `profile` prop that defaults to
`generalProfile`** — that's the whole mechanism behind the second page. Follow that
pattern if a new component needs per-page copy; don't import `site.ts` fields that vary.
`Footer` is profile-agnostic on purpose (its IP disclaimer is site-wide).

`src/layouts/Base.astro` holds `<head>`, Google Fonts (Inter + JetBrains Mono), OG tags,
and the scroll-reveal IntersectionObserver; it takes `title`/`description`, which each
page passes from its profile. `src/styles/global.css` has the design tokens (CSS custom
properties; cyan accent `--accent`).

## Type checking is part of the build

`npm run build` runs `astro check` first. This matters more than usual here: the site is
data-driven, so **typos in data are the main failure mode**, and `astro build` alone only
strips types without checking them. `@astrojs/check` + `typescript` are devDependencies;
CI gets the check for free because it runs `npm run build`.

## Media pipeline

GitHub Pages limits: 100 MB/file hard, ~1 GB repo soft. So:

- **Online / large videos → YouTube embeds** (never hosted). Includes the 128 MB Pharos
  spotlight and official Towerborne Xbox footage (`officialFootage: true` shows a badge —
  that footage is studio marketing, not personal capture).
- **Short clips → in-repo silent loops.** [`scripts/convert-media.sh`](scripts/convert-media.sh)
  runs ffmpeg (`/c/Tools/ffmpeg/bin/ffmpeg.exe`, v4.0.2) over curated source clips →
  `<name>.mp4` (H.264) + `<name>.webm` (VP9) + `<name>-poster.jpg`, written to
  `public/assets/<slug>/`. Re-runnable; overwrites outputs. 1280px wide, silent.
  - `convert <src> <slug> <name> [start] [duration] [pre-filter]` — the optional trim
    turns a long narrated walkthrough into a 10–20s highlight (used for every Wētā XR
    loop). `pre-filter` is an ffmpeg filter applied before the scale, e.g.
    `crop=1918:1036:0:0` to cut a Windows taskbar off a screen recording.
  - **Pass slugs to limit the run:** `bash scripts/convert-media.sh ar-scouting` — a
    full run re-encodes everything (minutes) and rewrites already-committed files.
  - ffmpeg 4.0.2 predates `xstack`; use `hstack`/`vstack` when building contact sheets.
    When picking trim points, sample frames with **accurate seek** (`-ss` *after* `-i`) —
    fast seek plus an `fps` filter rebases timestamps and the times you read off a
    contact sheet will be wrong by seconds.

### Stills are served as WebP

Every still in `public/assets/` has a `.webp` sibling.
[`scripts/optimize-images.sh`](scripts/optimize-images.sh) generates them in bulk
(idempotent — re-run any time); `convert-media.sh` and `make-banner.sh` also emit theirs
inline so a newly added loop can't silently lose its poster. This cut page image weight
roughly in half (front page 1581 → 732 KB, XR page 1554 → 840 KB).

Two serving rules, and the reason for the split:

- **`<img>` → `<picture>` with a JPG fallback** (`ProjectImage`, the `About` profile
  photo). Costs nothing, so it's free insurance.
- **`<video poster>` and CSS `background-image` → the `.webp` directly, no fallback**
  (`VideoLoop`, `VideoEmbed`, `Hero`). Neither can express a fallback, and it's safe:
  `global.css` already uses `color-mix()` and `svh`, which need much newer browsers
  (Chrome 111 / Safari 16.2) than WebP does (Chrome 32 / Safari 14).

`astro:assets` / `<Image />` was deliberately **not** used: it only optimizes images
imported from `src/`, and this pipeline generates files into `public/assets/` that the
data files reference by string name. Adopting it would mean moving assets into `src/`,
bridging the string names with `import.meta.glob`, changing the convert script's output
paths, and installing `sharp` (no longer bundled in Astro 7) — all to fight the
data-driven design for the same bytes. Revisit only if responsive `srcset` is wanted.

Raw source folders (`LEGO_BRICK_EDITOR/`, `Exodus/`, `Childish Gambino's Pharos/`,
`WETA_XR/`) are **git-ignored** — originals kept locally, only converted copies in
`public/assets/` are committed. `WETA_XR/` holds local copies of the Wētā XR captures
from `\\192.168.0.175\Box\work\videos\WetaSpecialProjectGroundVideos` (copied locally so
conversions re-run without the share mounted).

`resume.pdf` is generated by the separate **ResumeBuilder** repo
(`E:\dev\projects\ResumeBuilder`): the source is `content/eric_feng_2p.md`, built with
`python build_resume.py content/eric_feng_2p.md` → `output/eric_feng_2p.pdf`.
[`scripts/sync-resume.mjs`](scripts/sync-resume.mjs) copies that into `public/resume.pdf`
(the committed, served copy) and runs automatically on `predev`/`prebuild` and from the
`.githooks/pre-commit` hook, which also stages it (enable per clone:
`git config core.hooksPath .githooks`). It's a **copy, not a symlink**, on purpose: Pages
builds from git on Ubuntu, where the ResumeBuilder path doesn't exist; in CI the script is a
no-op. Root `resume.pdf` is just a git-ignored local symlink to the output, for convenience. That markdown is also the **source of truth for
site copy** — `timeline`/`skills` in `site.ts` and project dates/bullets in `projects.ts`
mirror it (skill levels map 90 → expert, 80 → advanced, 70 → proficient). The two Wētā XR
projects are site-only; the résumé omits them.

Asset weight is ~105 MB total; GitHub Pages' limits are 100 MB/file (hard) and ~1 GB/repo
(soft). Keep individual loops under ~8 MB.

## Commands

```bash
npm install              # deps
npm run dev              # dev server, http://localhost:4321/portfolio (and /portfolio/xr)
npm run check            # astro check — type-checks .astro + data files
npm run build            # astro check && astro build → dist/
npm run preview          # preview dist/
bash scripts/convert-media.sh                 # (re)generate ALL in-repo video loops
bash scripts/convert-media.sh ar-scouting     # …or only the given slug(s)
bash scripts/make-banner.sh                   # compose the hero banner strips
bash scripts/optimize-images.sh               # .webp siblings for every still
```

**ffmpeg gotchas hit in this repo:** v4.0.2 has no `xstack` (use `hstack`/`vstack`), and
`ffmpeg` reads stdin — inside a `while read` loop it eats the filename stream, so pass
`-nostdin` (this silently truncated paths in `optimize-images.sh` until fixed).

## Deploy

**Stack versions:** Astro **7.x** (upgraded from 4.16 in Aug 2026 — no config migration
was needed), which requires **Node ≥ 22.12**; CI pins Node 22. `@astrojs/check` +
`typescript` are devDependencies so `npm run build` type-checks.

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

**Front page (`projects`):** LEGO Brick Editor → Exodus → Towerborne → CoD: MWIII →
Pharos → Frostbite → Atlas → Block Party 2 (ILM) → Framestore mocap tools → Autodesk FBX
(Block Party 2 = SIGGRAPH talk UI screenshot, Framestore = Gravity still, FBX = text-only).
Media: LEGO (`7J7J0zm5xFc` + 4 local loops), Exodus (`ye14LA-FJnY` + 6 local loops),
Towerborne official (`4RhVFeNIBi0`, `YQlDe-tBV4E`, `7bY1Hgia6_I`), Pharos
(`DTAW0i7NSoo`), Atlas (`e8DUEO_Sr7Y`), CoD (key-art image), Frostbite (hosted EA sizzle).

**XR page (`xrProfile.projects`), recognizable-first:** LEGO Brick Editor → Exodus →
AR Scouting → Holoplayer → Pharos → Atlas. CoD / Towerborne / Frostbite are deliberately
omitted. LEGO, Exodus, Pharos and Atlas are re-framed via `projectBySlug` overrides.

**Wētā XR loops** (trimmed from `WETA_XR/`): `ar-scouting` →
`scout-character` (character on location + time-of-day sweep, featured),
`scout-camera` (on-device AR placement), `scout-scan` (photogrammetry scan, taskbar
cropped); `holoplayer` → `holo-align` (play-space alignment, featured),
`holo-playback` (character performing in the room).
Both new projects have a **commented-out `youtube` entry** at the top of `media[]`:
pasting a real id there promotes the narrated walkthrough to the featured slot.

Spec: [docs/superpowers/specs/2026-06-22-portfolio-website-design.md](docs/superpowers/specs/2026-06-22-portfolio-website-design.md).
