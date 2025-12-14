# Quick Start - Running slackfmt Locally

## Prerequisites
- Go installed on your machine (check with `go version`)

## Install and Set Up (Recommended)

**Install globally and create `fmtmd` alias:**

```bash
# Install the tool
go install github.com/rynf1t/slackfmt@latest

# Create fmtmd alias (shorter command name)
ln -sf ~/go/bin/slackfmt ~/go/bin/fmtmd

# Make sure ~/go/bin is in your PATH (add to ~/.zshrc or ~/.bashrc if needed)
export PATH="$HOME/go/bin:$PATH"
```

Now you can use `fmtmd` from anywhere!

## Quick Test

**From any directory:**
```bash
echo "# Hello **world**" | fmtmd
```

This copies formatted HTML to your clipboard. Then paste into Slack or Google Docs to see the formatting!

**With a file:**
```bash
cat myfile.md | fmtmd
```

## Common Usage

```bash
# From stdin - simplest usage
echo "# Heading" | fmtmd

# From a file
fmtmd myfile.md

# From clipboard (reads what's currently in clipboard)
fmtmd -c

# Save to file instead of clipboard
fmtmd input.md -o output.html

# Just print to stdout (don't copy to clipboard)
fmtmd input.md -clipboard=false
```

## Build Locally (Alternative)

If you want to build from source:

```bash
cd slackfmt
go build -o slackfmt
./slackfmt input.md
```

