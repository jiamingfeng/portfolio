#!/usr/bin/env bash
# =============================================================================
#  convert-media.sh — turn raw gameplay clips/GIFs into web-optimized silent
#  loops (MP4 + WebM) plus a poster frame, written into public/assets/<slug>/.
#
#  Run from the repo root:   bash scripts/convert-media.sh
#  Requires ffmpeg (set FFMPEG below or have it on PATH).
#
#  Re-run any time after dropping new source clips in — it overwrites outputs.
#  See CONTENT.md for how to add/curate clips and cut sizzle reels.
# =============================================================================
set -euo pipefail

FFMPEG="${FFMPEG:-/c/Tools/ffmpeg/bin/ffmpeg.exe}"
command -v "$FFMPEG" >/dev/null 2>&1 || { echo "ffmpeg not found at $FFMPEG"; exit 1; }

# Max output width (px). Source is 1080p; 1280 keeps loops crisp but small.
W=1280

# convert <source-file> <slug> <out-name>
convert() {
  local src="$1" slug="$2" name="$3"
  local outdir="public/assets/$slug"
  mkdir -p "$outdir"
  echo ">> $name  ($src)"

  # H.264 MP4 — broad compatibility, silent, faststart for web.
  "$FFMPEG" -y -loglevel error -i "$src" \
    -an -vf "scale=${W}:-2:flags=lanczos" \
    -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart \
    "$outdir/$name.mp4"

  # VP9 WebM — smaller, modern browsers pick this first.
  "$FFMPEG" -y -loglevel error -i "$src" \
    -an -vf "scale=${W}:-2:flags=lanczos" \
    -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 \
    "$outdir/$name.webm"

  # Poster frame at ~1s (or first frame for very short clips).
  "$FFMPEG" -y -loglevel error -ss 00:00:01 -i "$src" -frames:v 1 \
    -vf "scale=${W}:-2:flags=lanczos" -q:v 3 "$outdir/$name-poster.jpg" \
    || "$FFMPEG" -y -loglevel error -i "$src" -frames:v 1 \
       -vf "scale=${W}:-2:flags=lanczos" -q:v 3 "$outdir/$name-poster.jpg"
}

EX="Exodus"

# --- Exodus: the systems Eric owned ---
convert "$EX/CollisionTest_SwingGrapple.mkv"        exodus swing-grapple
convert "$EX/summer2024_EricFeng_RailClaw.mp4"      exodus railclaw
convert "$EX/SlopeSlideFallEnter_w_angle_BS.mp4"    exodus slope-slide
convert "$EX/ZipToCover_Left.mp4"                   exodus zip-to-cover
convert "$EX/NPCAnimGym_traversal_inmotion.gif"     exodus npc-traversal
convert "$EX/NPCAnimGym_Aim.gif"                    exodus npc-aim

LEGO="LEGO_BRICK_EDITOR"

# --- LEGO Brick Editor: specific feature demos ---
convert "$LEGO/AtomBrickDetailedCollision_ProximitySnap_03.mp4" lego-brick-editor collision-snap
convert "$LEGO/direct-snap-gizmos.mp4"                          lego-brick-editor direct-snap
convert "$LEGO/ConnectedBricksColoring.mp4"                     lego-brick-editor connected-coloring
convert "$LEGO/Mutable_LEGO_Character_Demo_v1.mp4"              lego-brick-editor character-demo

echo "Done. Outputs in public/assets/*/"
