#!/usr/bin/env bash
# =============================================================================
#  make-banner.sh — build a hero banner strip: three full-bleed panels that
#  meet at slanted, feathered seams (each panel cross-fades into the next),
#  written to public/assets/banner/<name>.{jpg,webp}.
#
#  Run from the repo root:   bash scripts/make-banner.sh
#  Requires ffmpeg (set FFMPEG below or have it on PATH), curl (for YouTube
#  thumbnails), and the git-ignored source folders (WETA_XR/ etc.) — see
#  CONTENT.md.
#
#  The banner sits behind the hero text at 0.42 opacity under a dark gradient,
#  so pick BRIGHT, saturated frames — dark ones vanish once dimmed.
# =============================================================================
set -euo pipefail

FFMPEG="${FFMPEG:-/c/Tools/ffmpeg/bin/ffmpeg.exe}"
command -v "$FFMPEG" >/dev/null 2>&1 || { echo "ffmpeg not found at $FFMPEG"; exit 1; }

# Canvas + seam geometry. The canvas is cut into 3 equal sections (SEC wide);
# each panel is SEC + BLEND + SLANT wide so it reaches across the seam into
# its neighbour. Panels after the first get a left-edge alpha ramp BLEND px
# wide whose position slides SLANT px across the panel height — a "/" seam,
# further right at the top than at the bottom.
W=2560 H=720
N=3
SEC=$((W / N))
BLEND=220 SLANT=160
PW=$((SEC + BLEND + SLANT)) PH=$H
OVER=$(((BLEND + SLANT) / 2)) # how far each later panel starts left of its section

TMP="${TMPDIR:-/tmp}/banner-panels"
mkdir -p "$TMP"

# yt-thumb <video-id> <dest> — fetch a YouTube maxres thumbnail once.
yt_thumb() {
  local id="$1" dest="$2"
  [ -f "$dest" ] || curl -fsSL -o "$dest" "https://i.ytimg.com/vi/$id/maxresdefault.jpg"
}

# panel <index 0-2> <source> <timestamp> [pre-filter]
#   source may be a video or a still (use timestamp 0 for stills).
#   pre-filter crops chrome (taskbars, player bars) BEFORE the cover-scale.
panel() {
  local i="$1" src="$2" ts="$3" pre="${4:-}"
  local vf=""
  [ -n "$pre" ] && vf="${pre},"
  # Fill the panel like CSS object-fit:cover — scale up, then centre-crop.
  vf="${vf}scale=${PW}:${PH}:force_original_aspect_ratio=increase:flags=lanczos,crop=${PW}:${PH}"
  if [ "$i" -gt 0 ]; then
    # Feathered diagonal left edge: alpha 0 left of the seam line, ramping to
    # 255 over BLEND px. The seam line sits at SLANT*(1 - Y/H).
    vf="${vf},format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='255*clip((X-${SLANT}*(1-Y/H))/${BLEND},0,1)'"
  fi
  echo "   panel $i  <- $(basename "$src") @${ts}s"
  # Input-seek only when given a time: "-ss 0" before a still yields no frame.
  local seek=()
  [ "$ts" != 0 ] && seek=(-ss "$ts")
  # PNG keeps the alpha channel for the compose step.
  "$FFMPEG" -y -nostdin -loglevel error "${seek[@]}" -i "$src" -frames:v 1 -vf "$vf" "$TMP/p$i.png"
}

# compose <out-name>  — overlays $TMP/p0..p2 left to right; each later panel's
# alpha ramp blends it over the previous one.
compose() {
  local name="$1"
  local x1=$((SEC - OVER)) x2=$((2 * SEC - OVER))
  "$FFMPEG" -y -nostdin -loglevel error \
    -i "$TMP/p0.png" -i "$TMP/p1.png" -i "$TMP/p2.png" \
    -filter_complex "color=c=black:s=${W}x${H}[bg];[bg][0:v]overlay=0:0[a];[a][1:v]overlay=${x1}:0[b];[b][2:v]overlay=${x2}:0,format=yuv420p" \
    -frames:v 1 -q:v 2 "public/assets/banner/$name.jpg"
  # The hero loads the .webp (see Profile.banner); the .jpg stays as the
  # human-viewable artifact and the thing you re-encode from.
  "$FFMPEG" -y -nostdin -loglevel error -i "public/assets/banner/$name.jpg" \
    -frames:v 1 -c:v libwebp -quality 80 "public/assets/banner/$name.webp"
  echo ">> public/assets/banner/$name.{jpg,webp} ($(du -k "public/assets/banner/$name.jpg" | cut -f1)KB / $(du -k "public/assets/banner/$name.webp" | cut -f1)KB)"
}

XR="WETA_XR"
PHAROS="Childish Gambino's Pharos/Childish Gambino Creates a Fantasy World for Pharos _ Project Spotlight _ Unreal Engine.mp4"

# custom_panel <index> <name> <fallback-src> <fallback-ts> [fallback-pre-filter]
#   Uses banner-src/<name>.{jpg,png,webp} if you've dropped one in; otherwise
#   the fallback source/frame. The pre-filter applies to the fallback only —
#   it's tuned to that specific image.
custom_panel() {
  local i="$1" name="$2" ext
  for ext in jpg jpeg png webp; do
    if [ -f "banner-src/$name.$ext" ]; then panel "$i" "banner-src/$name.$ext" 0; return; fi
  done
  panel "$i" "$3" "$4" "${5:-}"
}

# --- Front page banner: LEGO Brick Editor → Exodus → Pharos ---
# Override any panel by dropping an image at banner-src/{lego,exodus,pharos}.jpg.
# Fallbacks: LEGO and Exodus use their YouTube thumbnails (title cards, like
# the official key art in the reference style); Pharos is the 1:50 frame of the
# spotlight video.
echo "Front banner:"
yt_thumb 7J7J0zm5xFc "LEGO_BRICK_EDITOR/yt-thumb.jpg"
yt_thumb ye14LA-FJnY "Exodus/yt-thumb.jpg"
custom_panel 0 lego   "LEGO_BRICK_EDITOR/yt-thumb.jpg" 0
# Exodus/yt-thumb.jpg is a dark 1920x1080 gameplay capture: delogo paints out
# the "WIP Gameplay - Not Representative of Final" caption (bottom centre) from
# its surroundings, then a gamma lift keeps it visible once the hero dims it.
custom_panel 1 exodus "Exodus/yt-thumb.jpg"            0 \
  "delogo=x=695:y=980:w=530:h=52,eq=gamma=1.7:saturation=1.15"
custom_panel 2 pharos "$PHAROS"                        110
compose banner

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
