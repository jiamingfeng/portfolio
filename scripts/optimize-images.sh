#!/usr/bin/env bash
# =============================================================================
#  optimize-images.sh — generate a .webp sibling for every still in
#  public/assets/, and a correctly-sized pair for the profile photo.
#
#  Run from the repo root:   bash scripts/optimize-images.sh
#
#  Idempotent: re-run any time after adding images (it overwrites its outputs).
#  Run it after convert-media.sh or make-banner.sh, since both emit new .jpg
#  stills that need WebP siblings.
#
#  WHY WEBP IS SERVED DIRECTLY (no fallback) for <video poster> and CSS
#  backgrounds: the site's own stylesheet already uses color-mix() and svh
#  units, which need far newer browsers than WebP does (Chrome 32 / Safari 14).
#  Plain <img> tags still get a <picture> + JPG fallback, because that costs
#  nothing. See ProjectImage.astro / About.astro.
# =============================================================================
set -euo pipefail

FFMPEG="${FFMPEG:-/c/Tools/ffmpeg/bin/ffmpeg.exe}"
command -v "$FFMPEG" >/dev/null 2>&1 || { echo "ffmpeg not found at $FFMPEG"; exit 1; }

QUALITY=80

kb() { du -k "$1" | cut -f1; }

# webp <source> <dest> [max-width]
webp() {
  local src="$1" dest="$2" width="${3:-}"
  local vf=""
  [ -n "$width" ] && vf="-vf scale=${width}:-2:flags=lanczos"
  # shellcheck disable=SC2086
  # -nostdin matters: without it ffmpeg eats the while-loop's input stream and
  # the next filename arrives truncated.
  "$FFMPEG" -y -nostdin -loglevel error -i "$src" $vf -frames:v 1 \
    -c:v libwebp -quality "$QUALITY" "$dest"
  printf "   %-46s %5sKB -> %5sKB\n" "$(basename "$dest")" "$(kb "$src")" "$(kb "$dest")"
}

# The profile photo is a special case: it's a 640px square rendered into a 120px
# slot, so ship 2x (240px) instead of the full-size original. eric.jpg stays as
# the uncompressed source; the -240 pair is what the page actually loads.
PROFILE_SRC="public/assets/profile/eric.jpg"

echo "Stills -> WebP (quality $QUALITY):"
while IFS= read -r f; do
  [ "$f" = "$PROFILE_SRC" ] && continue # handled below at the right size
  webp "$f" "${f%.*}.webp"
done < <(find public/assets -type f \( -name '*.jpg' -o -name '*.png' \) | sort)

if [ -f "$PROFILE_SRC" ]; then
  echo "Profile photo -> 240px pair (rendered at 120px):"
  "$FFMPEG" -y -nostdin -loglevel error -i "$PROFILE_SRC" -vf "scale=240:-2:flags=lanczos" \
    -frames:v 1 -q:v 3 "public/assets/profile/eric-240.jpg"
  printf "   %-46s %5sKB -> %5sKB\n" "eric-240.jpg" "$(kb "$PROFILE_SRC")" "$(kb public/assets/profile/eric-240.jpg)"
  webp "$PROFILE_SRC" "public/assets/profile/eric-240.webp" 240
fi

echo "Done."
