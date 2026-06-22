# Eric Feng — Portfolio

A dark, cinematic single-page portfolio built with [Astro](https://astro.build),
deployed as a static site to GitHub Pages.

- **Live content** is data-driven: edit `src/data/projects.ts` and `src/data/site.ts`.
- **Media:** YouTube embeds (lazy-loaded) for online footage; small in-repo silent
  loops (MP4 + WebM) for gameplay clips, generated from source files with ffmpeg.

> **See [CONTENT.md](CONTENT.md)** for how to update materials, add a new project,
> and cut a sizzle reel.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
```

Build + preview the production output:

```bash
npm run build      # outputs to dist/
npm run preview
```

## Project structure

```
src/
  data/
    projects.ts      # ← all project content (the main file you edit)
    site.ts          # name, contact, skills, career timeline
  components/         # Nav, Hero, ProjectSection, YouTubeEmbed, VideoLoop, About, Contact, Footer
  layouts/Base.astro # <head>, fonts, global scripts
  pages/index.astro  # composes the single page
  styles/global.css  # design tokens + global styles
public/
  assets/<slug>/     # converted gameplay loops (.mp4/.webm/-poster.jpg)
  resume.pdf         # downloadable résumé
  favicon.svg
scripts/
  convert-media.sh   # ffmpeg pipeline: source clips → web loops
.github/workflows/deploy.yml  # CI build + deploy to GitHub Pages
```

Raw source media (`LEGO_BRICK_EDITOR/`, `Exodus/`, `Childish Gambino's Pharos/`) is
kept locally as originals and **git-ignored** — only the converted, web-optimized
copies under `public/assets/` are committed.

## Deploying to GitHub Pages (one-time setup)

1. **Create the repo** on GitHub. The config assumes a **project page** named
   `portfolio` under user `jiamingfeng`, giving the URL
   `https://jiamingfeng.github.io/portfolio`.
   - If your username or repo name differs, edit `USERNAME` / `REPO` at the top of
     [`astro.config.mjs`](astro.config.mjs).
   - For a **user page** (repo named `jiamingfeng.github.io`, URL
     `https://jiamingfeng.github.io`), set `base` to `'/'` (or remove it) in
     `astro.config.mjs`.

2. **Push the code:**

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/jiamingfeng/portfolio.git
   git push -u origin main
   ```

3. **Enable Pages:** in the repo, go to **Settings → Pages → Build and deployment**
   and set **Source: GitHub Actions**. The included workflow
   ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)) builds and
   publishes on every push to `main`.

4. Wait for the **Actions** tab to finish; your site goes live at the URL above.

### Custom domain (optional)

Add a `public/CNAME` file containing your domain (e.g. `ericfeng.dev`), configure
DNS per [GitHub's docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site),
and set `site` in `astro.config.mjs` to your domain with `base: '/'`.
