#!/bin/bash
# Unified push script with auto-generated commit message
# Usage: ./scripts/push.sh [directory] [message-prompt]
# Examples:
#   ./scripts/push.sh . "all changes to the site"
#   ./scripts/push.sh public/tools/ "changes to tools"
#   ./scripts/push.sh src/content/writing/ "changes to writing/blog posts"

set -e

DIR="${1:-.}"
MESSAGE_PROMPT="${2:-changes}"

# Determine if we should auto-generate tool descriptions
SHOULD_GENERATE_DOCS=false
if [ "$DIR" = "." ] || [ "$DIR" = "public/tools/" ]; then
    SHOULD_GENERATE_DOCS=true
fi

# Check if there are changes in the specified directory
if [ "$DIR" = "." ]; then
    # Check all changes
    if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
        echo "No changes to commit."
        exit 0
    fi
else
    # Check specific directory
    if git diff --quiet "$DIR" && git diff --cached --quiet -- "$DIR" && [ -z "$(git ls-files --others --exclude-standard "$DIR")" ]; then
        echo "No changes in $DIR to commit."
        exit 0
    fi
fi

# Auto-generate descriptions for tools without .md files (if applicable)
if [ "$SHOULD_GENERATE_DOCS" = true ]; then
    if command -v python3 &> /dev/null && python3 -c "import subprocess; subprocess.run(['llm', '--version'], capture_output=True, check=True)" 2>/dev/null; then
        echo "Auto-generating descriptions for tools without .md files..."
        python3 scripts/generate-docs.py 2>/dev/null || true
    fi
fi

# Stage changes
git add "$DIR"

# Get the diff
DIFF=$(git diff --cached)

# Generate commit message using LLM
echo "Generating commit message for $MESSAGE_PROMPT..."
COMMIT_MSG=$(echo "$DIFF" | llm -s "Generate a concise, professional git commit message (max 72 chars for subject line) for $MESSAGE_PROMPT. Focus on what changed, not how. Use imperative mood.")

# Trim whitespace and remove markdown code blocks
COMMIT_MSG=$(echo "$COMMIT_MSG" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^```.*$//' -e 's/```$//' | grep -v '^$' | head -n 1)

# Commit
git commit -m "$COMMIT_MSG"

# Push
echo "Pushing to origin..."
git push

