#!/bin/bash
set -euo pipefail

npm run make -- --platform=win32
npm run make -- --platform=darwin
npm run make -- --platform=linux

if command -v gh >/dev/null 2>&1; then
    version=$(node -p "require('./package.json').version")
    gh release create "v${version}" \
        ./dist/* \
        --title "KNOUX Player X v${version}" \
        --notes "${CHANGELOG:-Automated release}"
fi
