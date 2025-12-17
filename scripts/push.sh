#!/bin/bash
# Push with LLM-generated commit message
# Usage: ./scripts/push.sh [path]

set -e

PATH_TO_ADD="${1:-.}"

# Check for changes
if git diff --quiet "$PATH_TO_ADD" && git diff --cached --quiet -- "$PATH_TO_ADD" && [ -z "$(git ls-files --others --exclude-standard "$PATH_TO_ADD")" ]; then
    echo "No changes to commit."
    exit 0
fi

git add "$PATH_TO_ADD"

DIFF=$(git diff --cached)
COMMIT_MSG=""

if command -v llm &> /dev/null; then
    COMMIT_MSG=$(echo "$DIFF" | llm -s "Generate a concise git commit message (max 72 chars). Use imperative mood." 2>/dev/null | head -n 1)
fi

# Fallback
COMMIT_MSG="${COMMIT_MSG:-Update}"

git commit -m "$COMMIT_MSG"
git push
