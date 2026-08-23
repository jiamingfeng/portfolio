#!/usr/bin/env bash
# =============================================================================
#  make-banner.sh — build a hero banner strip: three 16:9 panels on the site's
#  near-black background, written to public/assets/banner/<name>.jpg.
#
#  Run from the repo root:   bash scripts/make-banner.sh
#  Requires ffmpeg (set FFMPEG below or have it on PATH) and the git-ignored
#  source folders (WETA_XR/ etc.) — see CONTENT.md.
#
#  The banner sits behind the hero text at 0.42 opacity under a dark gradient,
#  so pick BRIGHT, saturated frames — dark ones vanish once dimmed.
# =============================================================================
set -euo pipefail

FFMPEG="${FFMPEG:-/c/Tools/ffmpeg/bin/ffmpeg.exe}"
command -v "$FFMPEG" >/dev/null 2>&1 || { echo "ffmpeg not found at $FFMPEG"; exit 1; }

# Canvas + panel geometry. 3 panels, 16:9, evenly spaced with equal margins:
#   93 + 782 + 14 + 782 + 14 + 782 + 93 = 2560
W=2560 H=720
PW=782 PH=440 PY=140 GAP=14 MARGIN=93
BG=0x08090C # --bg from src/styles/global.css

TMP="${TMPDIR:-/tmp}/banner-panels"
mkdir -p "$TMP"

# panel <index 0-2> <source> <timestamp> [pre-filter]
#   pre-filter crops chrome (taskbars, player bars) BEFORE the cover-scale.
panel() {
  local i="$1" src="$2" ts="$3" pre="${4:-}"
  local vf=""
  [ -n "$pre" ] && vf="${pre},"
  # Fill the panel like CSS object-fit:cover — scale up, then centre-crop.
  vf="${vf}scale=${PW}:${PH}:force_original_aspect_ratio=increase:flags=lanczos,crop=${PW}:${PH}"
  echo "   panel $i  <- $(basename "$src") @${ts}s"
  "$FFMPEG" -y -loglevel error -i "$src" -ss "$ts" -frames:v 1 -vf "$vf" -q:v 2 "$TMP/p$i.jpg"
}

# compose <out-name>  — overlays $TMP/p0..p2 onto the background canvas.
compose() {
  local name="$1"
  local x0=$MARGIN x1=$((MARGIN + PW + GAP)) x2=$((MARGIN + 2 * (PW + GAP)))
  "$FFMPEG" -y -loglevel error \
    -f lavfi -i "color=c=${BG}:s=${W}x${H}" \
    -i "$TMP/p0.jpg" -i "$TMP/p1.jpg" -i "$TMP/p2.jpg" \
    -filter_complex "[0:v][1:v]overlay=${x0}:${PY}[a];[a][2:v]overlay=${x1}:${PY}[b];[b][3:v]overlay=${x2}:${PY}" \
    -frames:v 1 -q:v 2 "public/assets/banner/$name.jpg"
  # The hero loads the .webp (see Profile.banner); the .jpg stays as the
  # human-viewable artifact and the thing you re-encode from.
  "$FFMPEG" -y -nostdin -loglevel error -i "public/assets/banner/$name.jpg" \
    -frames:v 1 -c:v libwebp -quality 80 "public/assets/banner/$name.webp"
  echo ">> public/assets/banner/$name.{jpg,webp} ($(du -k "public/assets/banner/$name.jpg" | cut -f1)KB / $(du -k "public/assets/banner/$name.webp" | cut -f1)KB)"
}

XR="WETA_XR"

# --- XR page banner: Holoplayer → Pharos → AR Scouting ---
# Pharos sits in the middle: it's the most saturated panel, and its cool magenta
# reads well flanked by the two warm ones.
echo "XR banner:"
panel 0 "$XR/Holoplayer.mp4"         244
# Domevr is a windowed screen capture: drop the title bar (top ~26px) and the
# Explorer status bar + taskbar (from ~y=1040) off a 1920x1080 source.
panel 1 "$XR/Domevr_V01.mp4"          45  "crop=1920:1010:0:26"
# LocationScouting_03 renders a big "Time: HH:MM" time-of-day HUD across
# y≈830-1000. Keep the top 820px — that drops the HUD and tightens the framing
# onto the character against the sunrise.
panel 2 "$XR/LocationScouting_03.mp4" 23  "crop=1920:820:0:0"
compose banner-xr

echo "Done."
