// @ts-check
import { defineConfig } from 'astro/config';

// IMPORTANT — GitHub Pages URL configuration.
//
// Project page (repo named e.g. "portfolio"):  https://<user>.github.io/portfolio
//   -> set `site` to https://<user>.github.io and `base` to '/portfolio'
//
// User/org page (repo named "<user>.github.io"):  https://<user>.github.io
//   -> set `site` to https://<user>.github.io and REMOVE/empty the `base` line.
//
// Update <USERNAME> and the repo name below to match your GitHub repo.
const USERNAME = 'jiamingfeng'; // <-- change if your GitHub username differs
const REPO = 'portfolio'; // <-- change if you name the repo differently

export default defineConfig({
  site: `https://${USERNAME}.github.io`,
  base: `/${REPO}`,
  trailingSlash: 'ignore',
  build: {
    assets: 'assets/_astro',
  },
});
