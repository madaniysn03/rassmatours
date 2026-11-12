#!/usr/bin/env bash
# Genere les variantes responsives (600, 900, 1400 px) et les WebP de chaque JPEG maitre de public/images.
# Usage : bash scripts/image-variants.sh   (depuis rassmatours/ ; necessite ffmpeg avec libwebp)
set -euo pipefail
cd "$(dirname "$0")/.."
masters=$(find public/images -name '*.jpg' ! -name '*-600.jpg' ! -name '*-900.jpg' ! -name '*-1400.jpg' ! -name '*-og.jpg')
for f in $masters; do
  base="${f%.jpg}"
  width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$f")
  for w in 600 900 1400; do
    if [ "$w" -lt "$width" ] && [ ! -f "$base-$w.jpg" ]; then
      ffmpeg -loglevel error -y -i "$f" -vf "scale=$w:-2" -q:v 5 "$base-$w.jpg"
    fi
  done
  for j in "$base.jpg" "$base-600.jpg" "$base-900.jpg" "$base-1400.jpg"; do
    [ -f "$j" ] || continue
    [ -f "${j%.jpg}.webp" ] && continue
    q=80; case "$j" in *-600.jpg|*-900.jpg) q=78;; esac
    ffmpeg -loglevel error -y -i "$j" -c:v libwebp -quality $q "${j%.jpg}.webp"
  done
done
echo "jpg: $(find public/images -name '*.jpg' | wc -l), webp: $(find public/images -name '*.webp' | wc -l), total: $(du -sh public/images | cut -f1)"
