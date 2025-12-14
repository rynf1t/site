#!/bin/bash
# Push all site changes with auto-generated commit message

set -e

# Check if there are any changes at all
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    echo "No changes to commit."
    exit 0
fi

# Auto-generate descriptions for tools without .md files
if command -v python3 &> /dev/null && python3 -c "import subprocess; subprocess.run(['llm', '--version'], capture_output=True, check=True)" 2>/dev/null; then
    echo "Auto-generating descriptions for tools without .md files..."
    python3 scripts/generate-docs.py 2>/dev/null || true
fi

# Stage all changes
git add .

# Get the diff
DIFF=$(git diff --cached)

# Generate commit message using LLM
echo "Generating commit message for site changes..."
COMMIT_MSG=$(echo "$DIFF" | llm -s "Generate a concise, professional git commit message (max 72 chars for subject line) for all changes to the site. Focus on what changed, not how. Use imperative mood.")

# Trim whitespace and remove markdown code blocks
COMMIT_MSG=$(echo "$COMMIT_MSG" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^```.*$//' -e 's/```$//' | grep -v '^$' | head -n 1)

# Commit
git commit -m "$COMMIT_MSG"

# Push
echo "Pushing to origin..."
git push

