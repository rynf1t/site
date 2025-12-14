# slackfmt

Convert Markdown to Slack-compatible HTML format for pasting into Slack, Google Docs, etc.

## Installation

```bash
go build -o slackfmt
```

Or install globally:
```bash
go install
```

## Usage

```bash
# Read from stdin
echo "# Hello **world**" | ./slackfmt

# Read from file
./slackfmt input.md

# Read from clipboard
./slackfmt -c

# Write to file instead of clipboard
./slackfmt input.md -o output.html

# Output to stdout (don't copy to clipboard)
./slackfmt input.md -clipboard=false
```

## Note

This is a prototype. HTML clipboard format support is limited - it currently copies HTML as text. Full HTML clipboard support would require platform-specific implementations (AppleScript on macOS, etc.).


