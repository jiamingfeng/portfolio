# Banner source images

Drop replacement images for the front-page hero banner here, then run
`bash scripts/make-banner.sh`:

| File | Panel |
|---|---|
| `lego.jpg`   | left   — LEGO Brick Editor |
| `exodus.jpg` | middle — Exodus |
| `pharos.jpg` | right  — Pharos |

`.png` / `.webp` work too. A missing file falls back to the default
(YouTube thumbnail / video frame). Use 16:9, at least 1280×720, bright and
saturated. Images are cover-cropped from the centre, and the left
~220–380 px of the Exodus and Pharos images fades into the previous panel.
