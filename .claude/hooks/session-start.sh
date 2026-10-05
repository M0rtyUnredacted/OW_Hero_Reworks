#!/usr/bin/env bash
# Builds the OverPy-based Workshop validator so `node tools/validate.js` works
# immediately in a fresh session. Never blocks the session on failure.
cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0
if ! tools/setup.sh >/tmp/ow-setup.log 2>&1; then
    echo "OW toolchain setup failed (see /tmp/ow-setup.log). Run tools/setup.sh manually."
fi
exit 0
