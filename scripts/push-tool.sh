#!/bin/bash
# Push tool changes with auto-generated commit message

set -e

# Get the repo root
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# Check if there are changes in tools directory
if git diff --quiet public/tools/ && git diff --cached --quiet -- public/tools/ && [ -z "$(git ls-files --others --exclude-standard public/tools/)" ]; then
    echo "No changes in public/tools/ to commit."
    exit 0
fi

# Stage only tools directory changes
git add public/tools/

# Get the diff
DIFF=$(git diff --cached)

# Generate commit message using LLM
echo "Generating commit message for tool changes..."
COMMIT_MSG=$(echo "$DIFF" | llm -s "Generate a concise, professional git commit message (max 72 chars for subject line) for changes to tools. Focus on what changed, not how. Use imperative mood.")

# Trim whitespace and remove markdown code blocks
COMMIT_MSG=$(echo "$COMMIT_MSG" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^```.*$//' -e 's/```$//' | grep -v '^$' | head -n 1)

# Commit
git commit -m "$COMMIT_MSG"

# Push
echo "Pushing to origin..."
git push

