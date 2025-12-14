#!/bin/bash
# Generate git commit message using LLM

set -e

# Check if there are staged changes
if git diff --cached --quiet; then
    echo "No staged changes to commit."
    exit 1
fi

# Get the diff of staged changes
DIFF=$(git diff --cached)

# Generate commit message using LLM
echo "Generating commit message..."
COMMIT_MSG=$(echo "$DIFF" | llm -s "Generate a concise, professional git commit message (max 72 chars for subject line). Focus on what changed, not how. Use imperative mood (e.g. 'Add feature' not 'Added feature').")

# Trim whitespace and remove markdown code blocks
COMMIT_MSG=$(echo "$COMMIT_MSG" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^```.*$//' -e 's/```$//' | grep -v '^$' | head -n 1)

# Confirm the message
echo ""
echo "Generated commit message:"
echo "  $COMMIT_MSG"
echo ""
read -p "Use this message? (y/n/e to edit): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ee]$ ]]; then
    # Edit the message
    read -p "Edit message: " COMMIT_MSG
    git commit -m "$COMMIT_MSG"
elif [[ $REPLY =~ ^[Yy]$ ]] || [[ -z $REPLY ]]; then
    # Use the generated message
    git commit -m "$COMMIT_MSG"
else
    echo "Commit cancelled."
    exit 1
fi

