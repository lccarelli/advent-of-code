#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

cargo build --workspace --lib --release --target wasm32-unknown-unknown

rm -rf _site
mkdir -p _site
cp index.html _site/

for day in 20*/day-*/; do
  year=$(dirname "$day")
  name=$(basename "$day")
  site="_site/$year/$name"
  mkdir -p "$site"
  cp -R "$day/page/." "$site/"
  { cat scripts/page-head.html; cat "$day/page/index.html"; } > "$site/index.html"
  cp "target/wasm32-unknown-unknown/release/aoc_${year}_${name//-/_}.wasm" "$site/solution.wasm"
done

echo "Sitio listo en _site/"
