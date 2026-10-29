// =============================================================================
//  sync-resume.mjs — copy the latest ResumeBuilder PDF into public/resume.pdf.
//
//  Runs automatically before `npm run dev` / `npm run build` (predev/prebuild)
//  and from the git pre-commit hook (.githooks/pre-commit), so the committed,
//  served copy can't fall behind the résumé. Run by hand: npm run sync-resume
//
//  WHY A COPY, NOT A SYMLINK: GitHub Pages builds from git on Ubuntu, where the
//  ResumeBuilder checkout doesn't exist — a committed link would be dangling and
//  the live "Download résumé" button would break.
//
//  Source: the sibling ResumeBuilder repo by default; override with RESUME_SRC.
//  A missing source (e.g. in CI) is a no-op, not an error.
// =============================================================================
import { copyFileSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(fileURLToPath(import.meta.url), '../..');
const src = resolve(
  root,
  process.env.RESUME_SRC ?? '../ResumeBuilder/output/eric_feng_2p.pdf'
);
const dest = resolve(root, 'public/resume.pdf');

if (!existsSync(src)) {
  console.log(`sync-resume: ${src} not found — keeping the committed public/resume.pdf`);
} else if (existsSync(dest) && readFileSync(src).equals(readFileSync(dest))) {
  console.log('sync-resume: public/resume.pdf already up to date');
} else {
  copyFileSync(src, dest);
  console.log(`sync-resume: updated public/resume.pdf from ${src}`);
}
