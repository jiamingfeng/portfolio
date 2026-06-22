// Join a public-relative path to the configured GitHub Pages base path with
// exactly one slash. Works for both a project-page base ('/portfolio') and a
// user-page base ('/'), regardless of whether BASE_URL has a trailing slash.
const BASE = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  const b = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}
