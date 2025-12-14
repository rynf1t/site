# slackfmt

Convert Markdown to Slack-compatible HTML format for pasting into Slack, Google Docs, and other apps that recognize HTML clipboard format.

## Installation

### From Source

```bash
go install github.com/rynf1t/slackfmt@latest
```

This installs `slackfmt` to `~/go/bin/`. To use it as `fmtmd` from anywhere:

```bash
# Create alias (add to ~/.zshrc or ~/.bashrc)
ln -sf ~/go/bin/slackfmt ~/go/bin/fmtmd

# Make sure ~/go/bin is in your PATH (usually already is)
export PATH="$HOME/go/bin:$PATH"
```

Or build from source:

```bash
git clone https://github.com/rynf1t/slackfmt.git
cd slackfmt
go build -o slackfmt
```

### Pre-built Binaries

Download pre-built binaries from [GitHub Releases](https://github.com/rynf1t/slackfmt/releases) for macOS, Linux, and Windows.

## Usage

The tool is available as both `slackfmt` and `fmtmd` (if you set up the alias). Use it from anywhere:

```bash
# Read from stdin - simplest usage
echo "# Hello **world**" | fmtmd

# Read from file
fmtmd input.md
# or
slackfmt input.md

# Read from clipboard
fmtmd -c

# Write to file instead of clipboard
fmtmd input.md -o output.html

# Output to stdout (don't copy to clipboard)
fmtmd input.md -clipboard=false
```

**Note:** By default, the tool copies formatted HTML to your clipboard. Just paste into Slack or Google Docs!

## Features

- Converts Markdown to HTML with proper heading tags (`<h1>`, `<h2>`, `<h3>`) for Google Docs
- Converts to Slack format for plain text fallback
- Copies HTML to clipboard in a format recognized by Slack and Google Docs
- Supports all common Markdown features:
  - Headings
  - Bold and italic text
  - Lists (bulleted and numbered)
  - Code blocks and inline code
  - Links
  - Blockquotes
  - Strikethrough

## Platform Support

- **macOS**: Full HTML clipboard support using AppleScript
- **Linux**: Plain text clipboard (HTML clipboard support coming soon)
- **Windows**: Plain text clipboard (HTML clipboard support coming soon)

## How It Works

1. Reads Markdown from stdin, file, or clipboard
2. Converts directly to HTML (preserving heading structure for Google Docs)
3. Also generates Slack-formatted text as a fallback
4. Copies HTML to clipboard using platform-specific methods
5. When you paste into Slack or Google Docs, the HTML format is recognized and formatting is applied

## Examples

```bash
# Convert a markdown file and paste into Slack
fmtmd meeting-notes.md

# Convert from clipboard and paste into Google Docs
fmtmd -c

# Pipe markdown from anywhere
cat notes.md | fmtmd
```

## Troubleshooting

- **Formatting doesn't work when pasting**: Make sure you're pasting into an app that recognizes HTML clipboard format (Slack, Google Docs, etc.)
- **Clipboard errors on macOS**: Ensure you've granted Terminal/iTerm accessibility permissions in System Preferences
- **HTML clipboard not working**: The tool will fall back to plain text. HTML clipboard support is currently only available on macOS.

## See Also

- [Web version](https://rynf1t.github.io/slack-formatter/) - Use the tool in your browser
- [All Tools](https://rynf1t.com/tools) - Browse all available tools
