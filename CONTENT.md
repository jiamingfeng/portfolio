# Content guide — updating & extending the portfolio

Everything visible on the site is data-driven. You almost never touch components —
you edit **`src/data/projects.ts`** (projects) and **`src/data/site.ts`** (identity,
contact, skills, career timeline), and drop media into `public/assets/`.

After any change: `npm run dev` to preview, then commit + push (CI redeploys).

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

The **first project whose `media` is empty** (e.g. CoD: MWIII, Frostbite) renders as a
text-only card — perfectly fine for NDA'd work.

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
3. Run it:
   ```bash
   bash scripts/convert-media.sh
   ```
   This produces `my-clip.mp4`, `my-clip.webm`, and `my-clip-poster.jpg`.
4. Reference it in the project's `media`:
   ```ts
   { type: 'loop', src: 'my-clip', poster: 'my-clip-poster', title: 'My clip' }
   ```

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
2. Fill in `slug` (unique, kebab-case), `title`, `role`, `period`, `blurb`,
   `contributions`, optional `link`, and `media`.
3. If it has in-repo loops, create `public/assets/<slug>/` and add `convert` lines per
   section 2. YouTube-only projects need no asset folder.
4. `npm run dev` to verify, then commit + push.

That's the entire process — no component or layout edits.

> **Atlas** (the Wētā FX scene-description project) was added exactly this way: one
> entry in `projects.ts` with a single `youtube` media item, no asset folder.

## 4. Cut a sizzle reel from full gameplay

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

## 5. Replace the résumé

Drop a new `resume.pdf` into `public/`. The hero and contact "Download résumé" buttons
link to it automatically (`public/resume.pdf` → served at `/resume.pdf`).

## 6. Change identity / contact / skills / timeline

Edit [`src/data/site.ts`](src/data/site.ts): `site` (name, tagline, summary, SEO),
`contact` (email, LinkedIn, resume path), `skills`, and `timeline`.
