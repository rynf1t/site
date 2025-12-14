#!/bin/bash
# Push writing changes with auto-generated commit message
# Wrapper around unified push.sh script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/push.sh" src/content/writing/ "changes to writing/blog posts"

