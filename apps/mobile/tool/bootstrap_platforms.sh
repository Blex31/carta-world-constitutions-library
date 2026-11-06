#!/usr/bin/env bash
set -euo pipefail

# Generate official Flutter runners, preserving the committed CARTA Dart source.
ROOT="$(cd "$(dirname "\${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ ! -d android || ! -d ios ]]; then
  TMP_DIR="$(mktemp -d)"
  cleanup() { rm -rf "$TMP_DIR"; }
  trap cleanup EXIT

  cp pubspec.yaml "$TMP_DIR/pubspec.yaml"
  cp -R lib "$TMP_DIR/lib"
  cp -R test "$TMP_DIR/test"

  flutter create \
    --empty \
    --platforms=android,ios \
    --org com.aztechnor \
    --project-name carta_mobile \
    .

  cp "$TMP_DIR/pubspec.yaml" pubspec.yaml
  rm -rf lib test
  cp -R "$TMP_DIR/lib" lib
  cp -R "$TMP_DIR/test" test
fi

python3 tool/configure_deep_links.py
echo "Android and iOS runners are ready. Review signing, icons and store setup before release."
