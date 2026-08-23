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

# Optionally limit the run to certain project slugs — a full run re-encodes every
# clip (minutes) and rewrites files already committed. Examples:
#   bash scripts/convert-media.sh                        # everything
#   bash scripts/convert-media.sh ar-scouting holoplayer # just those two
ONLY=("$@")

want() {
  [ ${#ONLY[@]} -eq 0 ] && return 0
  local s
  for s in "${ONLY[@]}"; do
    [ "$s" = "$1" ] && return 0
  done
  return 1
}

# convert <source-file> <slug> <out-name> [start] [duration] [pre-filter]
#
#   start / duration  — optional trim, in seconds or hh:mm:ss. Use these when the
#                       source is a long walkthrough and you only want the good
#                       12–20s. Omit both to convert the whole clip (the original
#                       behaviour — existing call sites are unaffected).
#   pre-filter        — optional ffmpeg filter applied BEFORE the scale, e.g.
#                       "crop=1918:1036:0:0" to cut a Windows taskbar off a
#                       screen recording.
convert() {
  local src="$1" slug="$2" name="$3" start="${4:-}" dur="${5:-}" pre="${6:-}"
  want "$slug" || return 0
  local outdir="public/assets/$slug"
  mkdir -p "$outdir"
  echo ">> $name  ($src${start:+ @${start}s${dur:+ +${dur}s}})"

  # Trim goes BEFORE -i so ffmpeg seeks instead of decoding from zero.
  local trim=()
  [ -n "$start" ] && trim+=(-ss "$start")
  [ -n "$dur" ] && trim+=(-t "$dur")

  local vf="scale=${W}:-2:flags=lanczos"
  [ -n "$pre" ] && vf="${pre},${vf}"

  # H.264 MP4 — broad compatibility, silent, faststart for web.
  "$FFMPEG" -y -loglevel error ${trim[@]+"${trim[@]}"} -i "$src" \
    -an -vf "$vf" \
    -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart \
    "$outdir/$name.mp4"

  # VP9 WebM — smaller, modern browsers pick this first.
  "$FFMPEG" -y -loglevel error ${trim[@]+"${trim[@]}"} -i "$src" \
    -an -vf "$vf" \
    -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 \
    "$outdir/$name.webm"

  # Poster frame: the trim's first frame when trimmed, else ~1s in (falling back
  # to the very first frame for very short clips).
  local poster_ss="${start:-00:00:01}"
  "$FFMPEG" -y -loglevel error -ss "$poster_ss" -i "$src" -frames:v 1 \
    -vf "$vf" -q:v 3 "$outdir/$name-poster.jpg" \
    || "$FFMPEG" -y -loglevel error -i "$src" -frames:v 1 \
       -vf "$vf" -q:v 3 "$outdir/$name-poster.jpg"

  # WebP sibling — VideoLoop points its `poster` at the .webp, so emitting it
  # here keeps a new loop from silently rendering with no poster. (Re-runnable in
  # bulk via scripts/optimize-images.sh.)
  "$FFMPEG" -y -nostdin -loglevel error -i "$outdir/$name-poster.jpg" -frames:v 1 \
    -c:v libwebp -quality 80 "$outdir/$name-poster.webp"
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

XR="WETA_XR"

# --- Wētā XR special projects (shown on the /xr page) ---
# Sources are long narrated walkthroughs, so each loop is a trimmed highlight.
# Timestamps were chosen by frame-sampling the sources; see CONTENT.md §7.

# AR location scouting. LocationScouting_03 leads: a virtual character standing in
# the real location while the time-of-day is scrubbed dawn → noon.
convert "$XR/LocationScouting_03.mp4"  ar-scouting scout-character 17 16
convert "$XR/LocationScouting_01.mp4"  ar-scouting scout-camera     46 10
# LocationScouting_02 is a desktop screen recording — crop the taskbar off the
# bottom before scaling (source is 1918x1080).
convert "$XR/LocationScouting_02.mp4"  ar-scouting scout-scan       40 16 "crop=1918:1036:0:0"

# Holoplayer (HoloLens). Alignment leads: the play space registering to the room.
convert "$XR/Holoplayer.mp4"           holoplayer  holo-align      124 16
convert "$XR/Holoplayer.mp4"           holoplayer  holo-playback   228 16

echo "Done. Outputs in public/assets/*/"
