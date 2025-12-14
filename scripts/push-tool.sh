#!/bin/bash
# Push tool changes with auto-generated commit message
# Wrapper around unified push.sh script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/push.sh" public/tools/ "changes to tools"

