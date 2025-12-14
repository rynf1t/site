#!/bin/bash
# Push all site changes with auto-generated commit message
# Wrapper around unified push.sh script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/push.sh" . "all changes to the site"

