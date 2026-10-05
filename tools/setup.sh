#!/usr/bin/env bash
# Builds the local Workshop toolchain (OverPy compiler/decompiler) into .tools/.
# Idempotent: re-running is a no-op once the pinned build exists.
# Usage: tools/setup.sh [--force]
set -euo pipefail

OVERPY_REPO="https://github.com/Zezombye/overpy.git"
# Pinned for reproducibility. Bump after a new hero/patch lands upstream,
# then re-run tools/gen-api-docs.js and commit the refreshed docs/api/.
OVERPY_COMMIT="ec763c1d245aa5485ef61af5b2bda4975bce4877"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT/.tools/overpy"
STAMP="$DEST/.built-$OVERPY_COMMIT"

if [[ "${1:-}" != "--force" && -f "$STAMP" ]]; then
    echo "OverPy toolchain already built ($OVERPY_COMMIT)."
    exit 0
fi

command -v node >/dev/null || { echo "node is required (>=18)" >&2; exit 1; }
command -v git  >/dev/null || { echo "git is required" >&2; exit 1; }

rm -rf "$DEST"
mkdir -p "$DEST"
git -C "$DEST" init -q
git -C "$DEST" remote add origin "$OVERPY_REPO"
git -C "$DEST" fetch -q --depth 1 origin "$OVERPY_COMMIT"
git -C "$DEST" checkout -q FETCH_HEAD

cd "$DEST"
# OverPy refuses npm/yarn; pnpm via npx avoids needing a global install.
npx -y pnpm@10 install --frozen-lockfile --silent
node esbuild.js --target standalone >/dev/null
node esbuild.js --target cli >/dev/null

touch "$STAMP"
echo "OverPy toolchain built at .tools/overpy ($OVERPY_COMMIT)."
