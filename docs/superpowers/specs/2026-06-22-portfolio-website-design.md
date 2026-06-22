# Eric Feng — Portfolio Website Design

**Date:** 2026-06-22
**Status:** Approved, in implementation

## Context

Eric Feng is a Principal/Lead game-engine & graphics engineer (LEGO, ex-Activision,
ex-EA, ex-Wētā FX, ex-ILM) job-hunting and wants a personal portfolio site to show
off shipped projects and gain attention from studios. The site must host on GitHub
Pages (free, default `*.github.io` URL), look technical and cinematic, and let
gameplay media — video especially — be the centerpiece.

Raw materials supplied: local gameplay clips/GIFs for LEGO Brick Editor, Exodus, and
Pharos; YouTube links for LEGO, Exodus, and Pharos; and (researched) official Xbox
YouTube footage for Towerborne. CoD: MWIII and Frostbite are text-only (NDA / no
personal footage).

## Decisions

- **Stack:** Astro static site → static output → GitHub Pages via GitHub Actions.
  No runtime JS framework. Fast first paint, trivial to host, easy to extend.
- **Aesthetic:** Dark / cinematic. Near-black background, bold large type, generous
  whitespace, media-forward, cool cyan accent. Lightweight scroll-reveal, no heavy libs.
- **Structure:** Single-page scroll — Hero → Projects → About/Skills/Timeline → Contact.
- **Hosting:** GitHub Pages default URL.
- **Media strategy:** YouTube embeds primary for projects that have them; short
  silent autoplay loops hosted in-repo (converted from local clips/GIFs) for texture
  and to prove specific system contributions. Large/online videos are embedded, never
  hosted (esp. the 128MB Pharos file → already on YouTube).
- **Contact:** Email, LinkedIn, downloadable resume.pdf.

## Architecture

- **Data-driven projects.** All project content lives in one data file
  (`src/data/projects.ts`). Adding a project = one entry + a media folder. This is the
  key maintainability decision and drives the "add a new project" workflow.
- **Site-wide data** (name, tagline, contact, timeline, skills) in `src/data/site.ts`.
- **Components** (`.astro`): `Nav`, `Hero`, `ProjectSection`, `YouTubeEmbed`
  (lazy-load facade — poster thumbnail + click-to-load iframe so embeds don't tax
  first paint), `VideoLoop` (muted/autoplay/loop/playsinline `<video>` with MP4+WebM
  sources and poster), `About`, `Timeline`, `Skills`, `Contact`, `Footer`.
- **Single page:** `src/pages/index.astro` composes the sections, mapping over the
  project data.
- **Layout:** `src/layouts/Base.astro` — head, fonts, global styles, meta/OG tags.

## Media pipeline

ffmpeg at `c:\Tools\ffmpeg\bin\ffmpeg.exe` (v4.0.2). A script
(`scripts/convert-media.sh`) converts curated source files into:
- `*.mp4` (H.264 yuv420p, faststart) and `*.webm` (VP9) — silent loops, capped width.
- `*-poster.jpg` — first/representative frame for `<video poster>` and embed facades.

Output → `public/assets/<project>/`. Source files in `LEGO_BRICK_EDITOR/`, `Exodus/`,
`Childish Gambino's Pharos/` are kept out of the deployed build (not under `public/`).

### Curated source → output

- **Exodus system loops:** `CollisionTest_SwingGrapple.mkv` (swing+grapple),
  `summer2024_EricFeng_RailClaw.mp4` (RailClaw), `SlopeSlideFallEnter_w_angle_BS.mp4`
  (balance/slope), `ZipToCover_Left.mp4` (camera transition),
  `NPCAnimGym_traversal_inmotion.gif` + `NPCAnimGym_Aim.gif` (NPC anim). Skip redundant
  collision tests, debug-string capture, long dynamic-grapple, and the duplicated GIF
  copies in `NPC Animations/`.
- **LEGO:** local MP4s available but section leads with YouTube embeds; a short loop
  from `Introduction.mp4` may be used as texture.

## Media inventory (embeds)

| Project | Media |
|---|---|
| LEGO Brick Editor | YouTube `7J7J0zm5xFc` (lead), `OQhOTe790kY` |
| Exodus | YouTube `ye14LA-FJnY` (full gameplay) + 6 in-repo system loops |
| Towerborne | Official Xbox YouTube `4RhVFeNIBi0`, `YQlDe-tBV4E`, `7bY1Hgia6_I` |
| Pharos | YouTube `DTAW0i7NSoo` (Unreal Engine spotlight) |
| CoD: MWIII | text only |
| Frostbite | text only |

Towerborne footage is official Xbox marketing — presented as official project footage,
not claimed as Eric's personal capture.

## Project order (by impact)

LEGO Brick Editor → Exodus → Towerborne → CoD: MWIII → Pharos → Frostbite.

## Deploy

`.github/workflows/deploy.yml` — on push to `main`: checkout, setup Node, `npm ci`,
`npm run build`, upload `dist/`, deploy to GitHub Pages. `astro.config.mjs` sets
`site` + `base` for the project-pages URL. README documents repo creation + enabling
Pages (source: GitHub Actions).

## Documentation deliverables

- **README.md** — what it is, local dev, build, deploy/GitHub setup steps.
- **CONTENT.md** — how to update project materials (media locations, ffmpeg commands,
  swapping a YouTube ID, replacing posters), how to add a new project (edit
  `projects.ts` + drop media), and how to cut a sizzle reel from full gameplay
  (ffmpeg trim/concat recipe) for Eric's later Exodus highlight edit.
- **CLAUDE.md** — architecture, data-driven structure, media pipeline, build/deploy
  commands, and the extend workflow, for future sessions.

## Verification

- `npm run build` succeeds, `dist/` produced.
- `npm run preview` (or `astro dev`) renders: hero, all six project sections with media
  playing/embeddable, about/timeline/skills, contact with working resume.pdf download.
- All in-repo loop files are browser-native (MP4/WebM) and comfortably under GitHub's
  100MB/file limit; total repo well under the 1GB soft cap.

## Out of scope (YAGNI)

Multi-page per-project detail views, CMS, blog, analytics, custom domain (kept open),
contact form backend, dark/light toggle (dark only).
