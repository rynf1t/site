#!/bin/bash
# Push writing changes with auto-generated commit message

set -e

# Get the repo root
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# Check if there are changes in writing directory
if git diff --quiet src/content/writing/ && git diff --cached --quiet -- src/content/writing/ && [ -z "$(git ls-files --others --exclude-standard src/content/writing/)" ]; then
    echo "No changes in src/content/writing/ to commit."
    exit 0
fi

# Stage only writing directory changes
git add src/content/writing/

# Get the diff
DIFF=$(git diff --cached)

# Generate commit message using LLM
echo "Generating commit message for writing changes..."
COMMIT_MSG=$(echo "$DIFF" | llm -s "Generate a concise, professional git commit message (max 72 chars for subject line) for changes to writing/blog posts. Focus on what changed, not how. Use imperative mood.")

# Trim whitespace and remove markdown code blocks
COMMIT_MSG=$(echo "$COMMIT_MSG" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^```.*$//' -e 's/```$//' | grep -v '^$' | head -n 1)

# Commit
git commit -m "$COMMIT_MSG"

# Push
echo "Pushing to origin..."
git push

