#!/usr/bin/env bash
# Builds branded 16:9 posters for the YouTube facade: "before" and "after"
# frames from the original video, laid out by scripts/video-posters/poster.html
# (texts live there) and rendered with headless Chrome.
# Requires yt-dlp, ffmpeg, avifenc and Google Chrome (override with $CHROME).
#
# Usage: scripts/make-video-posters.sh
# Edit POSTERS to change frames: "<youtube id> <before s> <after s> <output>".
# The line order matches the video number in poster.html.
set -euo pipefail

POSTERS=(
  "wwzq9kUryF8 13 110 posterFirstVideo"
  "AczPuWS2BeQ 6 46 posterSecondVideo"
)
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE="$ROOT/scripts/video-posters/poster.html"
OUT_DIR="$ROOT/src/assets/video"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

frame() {
  local video="$1" second="$2" out="$3" crop
  # Some uploads carry baked-in black bars; crop them before use.
  crop="$(ffmpeg -ss "$second" -t 2 -i "$video" -vf cropdetect=24:2:0 \
    -f null - 2>&1 | grep -o 'crop=[0-9:]*' | tail -1)"
  ffmpeg -v error -y -ss "$second" -i "$video" -frames:v 1 \
    -vf "${crop:-null}" -q:v 2 "$out"
}

number=0
for entry in "${POSTERS[@]}"; do
  read -r id before after name <<<"$entry"
  number=$((number + 1))
  video="$WORK/$id.mp4"

  yt-dlp -q --no-warnings -f "bv*[ext=mp4]/bv*" -o "$video" \
    "https://www.youtube.com/watch?v=$id"
  frame "$video" "$before" "$WORK/$id-before.jpg"
  frame "$video" "$after" "$WORK/$id-after.jpg"

  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --allow-file-access-from-files --virtual-time-budget=4000 \
    --window-size=1600,900 --screenshot="$WORK/$name.png" \
    "file://$TEMPLATE?n=$number&before=file://$WORK/$id-before.jpg&after=file://$WORK/$id-after.jpg" \
    2>/dev/null

  avifenc -q 70 -s 4 "$WORK/$name.png" "$OUT_DIR/$name.avif" >/dev/null
  echo "$OUT_DIR/$name.avif"
done
