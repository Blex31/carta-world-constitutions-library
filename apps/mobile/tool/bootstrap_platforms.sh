#!/usr/bin/env bash
set -euo pipefail

# Generate the official Flutter Android and iOS runner projects while preserving
# CARTA's checked-in pubspec.yaml and Dart source.
ROOT="$(cd "$(dirname "\${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -d android && -d ios ]]; then
  echo "Android and iOS runner projects already exist."
  exit 0
fi

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

echo "Generated Android and iOS runners. Review signing, app icons and deep-link configuration before store builds."
