# Content guide — updating & extending the portfolio

Everything visible on the site is data-driven. You almost never touch components —
you edit three data files and drop media into `public/assets/`:

| File | Holds |
|---|---|
| **`src/data/projects.ts`** | every project + its media + its skill tags |
| **`src/data/site.ts`** | identity, contact, skill *levels*, career timeline |
| **`src/data/profiles.ts`** | the two page pitches: `/` (general) and `/xr` (XR) |

There are **two pages**: the general portfolio at `/` and the XR-focused one at `/xr`.
They share all components and media, and differ only by their `Profile`.

After any change: `npm run dev` to preview both pages, then commit + push (CI redeploys).
`npm run build` type-checks before building, so a mistyped tag or slug fails fast.

---

## 1. Update an existing project

Open [`src/data/projects.ts`](src/data/projects.ts) and edit the project's entry:

- **Text** — `title`, `role`, `period`, `blurb`, `contributions[]`, `link`.
- **Swap / add a YouTube video** — add or change an item in `media`:
  ```ts
  { type: 'youtube', id: 'VIDEO_ID', title: 'What it shows' }
  ```
  The `id` is the part after `watch?v=` in the URL
  (`https://youtube.com/watch?v=`**`ye14LA-FJnY`** → `ye14LA-FJnY`).
- **Reorder media** — the first item in `media` renders large (featured); the rest
  render in a 2-up grid below. Reorder the array to change what leads.

A project whose `media` is empty renders as a text-only card — perfectly fine for
NDA'd work.

### Tag a project

Each project shows a row of skill pills, from its `tags` array:

```ts
tags: ['Unreal Engine', 'C++', 'Editor Tooling', 'UX'],
```

Tags come from a fixed list (the `Tag` type at the top of `projects.ts`) — engines,
languages, gameplay, tools, XR, systems. **Up to about 7, engine or domain first**; past
that they wrap to three rows on a phone. To use a tag that isn't in the list, add it to
the `Tag` union first; otherwise `npm run build` fails
with `Type '"..."' is not assignable to type 'Tag'`, which is deliberate — it stops
`C++` and `C/C++` both existing.

## 2. Add a new in-repo gameplay loop (silent video)

Use this for short clips you want hosted directly (no YouTube). Browsers can't play
`.mkv` or huge `.gif`, so convert first.

1. Put the source clip somewhere local (e.g. the `Exodus/` source folder).
2. Add a line to [`scripts/convert-media.sh`](scripts/convert-media.sh):
   ```bash
   convert "Exodus/MyClip.mkv"   exodus   my-clip
   #         ^source path         ^slug    ^output base name
   ```
   `slug` must match the project's `slug` in `projects.ts` (output goes to
   `public/assets/<slug>/`).

   **Trimming a long source** — add a start and duration in seconds. Use this when the
   source is a multi-minute walkthrough and you only want the good bit:
   ```bash
   convert "WETA_XR/Holoplayer.mp4"  holoplayer  holo-align  124 16
   #                                              ^name    start ^duration
   ```
   A sixth argument is an ffmpeg filter applied before scaling — mainly to crop chrome
   off a screen recording: `"crop=1918:1036:0:0"` drops a Windows taskbar.
3. Run it — **pass slugs to convert only what you changed**, since a full run
   re-encodes every clip (minutes) and rewrites files already committed:
   ```bash
   bash scripts/convert-media.sh holoplayer     # just this project
   bash scripts/convert-media.sh                # everything
   ```
   This produces `my-clip.mp4`, `my-clip.webm`, and `my-clip-poster.jpg`. The poster is
   the trim's first frame (or ~1s in, untrimmed) — so **the start time you pick is also
   your thumbnail**. Aim for a frame that shows the feature, not a dark or empty one.
4. Reference it in the project's `media`:
   ```ts
   { type: 'loop', src: 'my-clip', poster: 'my-clip-poster', title: 'My clip' }
   ```

The script also writes `my-clip-poster.webp`, which is what the page actually loads.
If you ever add a still **by hand** (dropping a JPG or PNG into `public/assets/`), run:

```bash
bash scripts/optimize-images.sh
```

It creates a `.webp` sibling for every still and is safe to re-run. Skipping it means a
poster silently doesn't show, because the components point at the `.webp`.

### The ffmpeg commands (if converting by hand / in Adobe)

The script targets 1280px-wide, silent, web-optimized output. Equivalents:

```bash
# MP4 (H.264)
ffmpeg -i IN -an -vf "scale=1280:-2" -c:v libx264 -preset slow -crf 24 \
  -pix_fmt yuv420p -movflags +faststart OUT.mp4
# WebM (VP9)
ffmpeg -i IN -an -vf "scale=1280:-2" -c:v libvpx-vp9 -b:v 0 -crf 34 OUT.webm
# Poster frame at 1s
ffmpeg -ss 1 -i IN -frames:v 1 -vf "scale=1280:-2" -q:v 3 OUT-poster.jpg
```

In **Adobe Media Encoder**: export H.264, 1280px wide, no audio, "Fast Start" on, for
the `.mp4`; keep each loop under ~10 MB (GitHub's per-file limit is 100 MB, but small
is better for load time).

## 3. Add a whole new project

1. In [`src/data/projects.ts`](src/data/projects.ts), copy an existing entry in the
   `projects` array and paste it where you want it to appear (order = display order).
   For a project that should appear **only on the XR page**, put it in the
   `xrOnlyProjects` array instead.
2. Fill in `slug` (unique, kebab-case), `title`, `role`, `period`, `blurb`,
   `contributions`, `tags`, optional `link`, and `media`.
3. If it has in-repo loops, create `public/assets/<slug>/` and add `convert` lines per
   section 2. YouTube-only projects need no asset folder.
4. `npm run dev` to verify, then commit + push.

That's the entire process — no component or layout edits.

> **Atlas** (the Wētā FX scene-description project) was added exactly this way: one
> entry in `projects.ts` with a single `youtube` media item, no asset folder.

## 4. Edit the XR page (`/xr`)

Everything specific to the XR pitch lives in `xrProfile` in
[`src/data/profiles.ts`](src/data/profiles.ts): the hero tagline and summary, the SEO
strings, section headings, the "Open to…" contact line, and the skill order.

**The project lineup** is a list of `projectBySlug()` calls. To add a project, add a line:

```ts
projects: [
  projectBySlug('lego-brick-editor', { /* XR-specific copy, see below */ }),
  projectBySlug('ar-scouting'),          // no overrides — shown as-is
  …
]
```

**To re-frame a shared project for XR recruiters**, pass overrides — this reuses the same
entry (and the same media folder) with different words:

```ts
projectBySlug('exodus', {
  blurb: 'Player-feel engineering — traversal, camera transitions, and 3C.',
  contributions: ['…'],
  tags: ['Unreal Engine', 'Gameplay', '3C', 'Animation', 'C++'],
}),
```

Overrides are optional and independent — pass only the fields you want changed. A slug
that doesn't exist fails the build with a list of the valid ones.

**Skill levels are shared.** `xrProfile` only reorders the list; the levels themselves
live once in `site.ts`, so the two pages can never disagree. Renaming a skill in
`site.ts` without updating the order list fails the build.

## 5. Fill in a pending YouTube ID

AR Scouting and Holoplayer each have a commented-out `youtube` entry at the top of their
`media` array, waiting on an upload:

```ts
media: [
  // { type: 'youtube', id: 'REPLACE_ME', title: 'AR Location Scouting — full walkthrough' },
  { type: 'loop', src: 'scout-character', … },
```

Upload the narrated walkthrough (unlisted is fine), uncomment the line, and paste the id.
Because the **first** media item renders large, that automatically promotes the video to
the featured slot and pushes the silent loops into the grid below it — which is the
intended final shape for both projects.

## 6. Pick trim points by looking at frames

Don't guess timestamps. Build a contact sheet, then confirm the exact frame:

```bash
FF=/c/Tools/ffmpeg/bin/ffmpeg.exe
# Overview: one frame every 4s, tiled 5x4  (tile N ≈ t = N*4 + 2)
"$FF" -i WETA_XR/Holoplayer.mp4 -vf "fps=1/4,scale=300:-2,tile=5x4" -frames:v 1 sheet.jpg

# Confirm a specific second — note -ss comes AFTER -i (accurate seek)
"$FF" -i WETA_XR/Holoplayer.mp4 -ss 124 -frames:v 1 frame.jpg
```

**The accurate-seek detail matters.** With `-ss` *before* `-i`, ffmpeg fast-seeks to a
keyframe, and combining that with an `fps` filter rebases timestamps — so times read off
such a sheet can be several seconds out. The first pass above (no `-ss`) is reliable; use
the second form to verify before committing to a start time. ffmpeg 4.0.2 has no
`xstack`, so use `hstack`/`vstack` to join frames.

## 7. Change a hero banner

The wide strip behind the hero name is three 16:9 panels on the site's near-black
background, built by [`scripts/make-banner.sh`](scripts/make-banner.sh). Each page has
its own:

| Page | File | Panels |
|---|---|---|
| `/` | `banner/banner.webp` | LEGO · Exodus · Pharos dome VR |
| `/xr` | `banner/banner-xr.webp` | Holoplayer · Pharos dome VR · AR Scouting |

To change one, edit its `panel` lines in the script — source video, timestamp, and an
optional crop — then re-run `bash scripts/make-banner.sh`:

```bash
panel 0 "$XR/Holoplayer.mp4"         244                        # source, seconds
panel 1 "$XR/Domevr_V01.mp4"          45  "crop=1920:1010:0:26" # trim window chrome
```

**Pick bright, saturated frames.** The banner renders at 0.42 opacity under a dark
gradient, so dark footage disappears entirely. Crop out anything that gives away a screen
recording (taskbars, window title bars, debug HUDs) — the `panel` helper takes a filter
for exactly that. Which file a page uses is the `banner` field in
[`src/data/profiles.ts`](src/data/profiles.ts).

## 8. Cut a sizzle reel from full gameplay

You mentioned wanting to trim the full Exodus gameplay (`ye14LA-FJnY`) down to just the
systems you owned. Two routes:

**A. Upload the reel to YouTube** (recommended — no repo bloat): edit your highlights in
Premiere/Media Encoder, upload (unlisted is fine), then add its `id` as a `youtube`
media item.

**B. Host a trimmed loop in-repo:** if you have the source video locally, trim and
concat segments with ffmpeg, then run it through the convert pipeline. Example —
extract three segments by timestamp and join them:

```bash
# Cut segments (copy is fast; re-encode if cuts look off):
ffmpeg -ss 00:01:12 -to 00:01:20 -i FULL.mp4 -c copy seg1.mp4
ffmpeg -ss 00:03:40 -to 00:03:52 -i FULL.mp4 -c copy seg2.mp4
ffmpeg -ss 00:07:05 -to 00:07:18 -i FULL.mp4 -c copy seg3.mp4

# Concat:
printf "file 'seg1.mp4'\nfile 'seg2.mp4'\nfile 'seg3.mp4'\n" > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy sizzle.mp4

# Then convert sizzle.mp4 to web loops via the pipeline in section 2.
```

Note the timestamps of your owned systems while watching the full video, then plug them
into the cuts above.

## 9. Update the résumé

[`resume.md`](resume.md) is the written source; `public/resume.pdf` is what visitors
download. **They are not linked by any script** — editing the markdown does not change the
PDF. The current PDF was produced with Chrome's Print to PDF, so to publish a change:

1. Edit `resume.md`.
2. Open it rendered (VS Code preview, or any markdown viewer) and **Print → Save as PDF**
   from Chrome.
3. Save over **both** `resume.pdf` (repo root) and `public/resume.pdf` — the served copy
   is the one in `public/`. The hero and contact "Download résumé" buttons pick it up
   automatically.

Keep dates consistent with `timeline` in `src/data/site.ts` — the site and the résumé are
read side by side.

## 10. Change identity / contact / skills / timeline

Edit [`src/data/site.ts`](src/data/site.ts): `site` (name, tagline, summary, SEO),
`contact` (email, LinkedIn, resume path), `skills` (names + levels), and `timeline`.
These are **shared by both pages**. Per-page copy (taglines, headings, the contact pitch)
lives in [`src/data/profiles.ts`](src/data/profiles.ts) — see section 4.
