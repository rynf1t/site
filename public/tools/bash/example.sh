#!/bin/bash
# Example bash script
# Usage: curl -s https://itsryan.me/tools/bash/example.sh | bash -s -- "your text"

if [ -z "$1" ]; then
    echo "Usage: $0 <text>"
    echo "Example: $0 'Hello, world!'"
    exit 1
fi

echo "You said: $*"
echo "In uppercase: $(echo "$*" | tr '[:lower:]' '[:upper:]')"
echo "Word count: $(echo "$*" | wc -w | tr -d ' ')"
