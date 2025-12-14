# Tool Migration Guide

This guide walks through migrating each tool to its own isolated repository.

## Overview

Each tool will become its own GitHub repository with:
- The tool files (HTML for web tools, Go code for CLI tools)
- A GitHub Pages workflow for deployment
- A README with usage instructions
- Links back to the main tools page

## Migration Steps for Each Tool

### 1. Coin Flip

**Repository**: `rynf1t/coin-flip`

**Files to create**:
- `index.html` - Copy from `public/tools/coin-flip.html`
- `README.md` - Create with description from `public/tools/coin-flip.md`
- `.github/workflows/deploy.yml` - GitHub Pages workflow

**Steps**:
1. Create repo `rynf1t/coin-flip` on GitHub
2. Copy `public/tools/coin-flip.html` to `index.html` in the new repo
3. Create `README.md` with the description
4. Add GitHub Pages workflow (see template below)
5. Enable GitHub Pages in repo settings (Source: GitHub Actions)
6. Push and verify deployment at `https://coin-flip.itsryan.me/` (after setting up custom domain)

### 2. Slack Formatter

**Repository**: `rynf1t/slack-formatter`

**Files to create**:
- `index.html` - Copy from `public/tools/slack-formatter.html`
- `README.md` - Create with description from `public/tools/slack-formatter.md`
- `.github/workflows/deploy.yml` - GitHub Pages workflow

**Steps**:
1. Create repo `rynf1t/slack-formatter` on GitHub
2. Copy `public/tools/slack-formatter.html` to `index.html` in the new repo
3. Create `README.md` with the description
4. Add GitHub Pages workflow
5. Enable GitHub Pages in repo settings
6. Push and verify deployment at `https://slack-formatter.itsryan.me/` (after setting up custom domain)

### 3. SQLite CSV Playground

**Repository**: `rynf1t/sqlite-csv-playground`

**Files to create**:
- `index.html` - Copy from `public/tools/sqlite-csv-playground.html`
- `README.md` - Create with description from `public/tools/sqlite-csv-playground.md`
- `docs.html` or `docs/` - If needed for the docs page
- `.github/workflows/deploy.yml` - GitHub Pages workflow

**Steps**:
1. Create repo `rynf1t/sqlite-csv-playground` on GitHub
2. Copy `public/tools/sqlite-csv-playground.html` to `index.html`
3. If there's a docs page, handle it (either as separate page or integrate)
4. Create `README.md` with the description
5. Add GitHub Pages workflow
6. Enable GitHub Pages in repo settings
7. Push and verify deployment at `https://sqlite-csv-playground.itsryan.me/` (after setting up custom domain)

### 4. slackfmt (CLI Tool)

**Repository**: `rynf1t/slackfmt`

**Files to create**:
- `main.go` - Copy from `slackfmt/main.go`
- `go.mod` - Copy from `slackfmt/go.mod`
- `go.sum` - Copy from `slackfmt/go.sum`
- `main_test.go` - Copy from `slackfmt/main_test.go`
- `README.md` - Update from `slackfmt/README.md` (update GitHub links)
- `index.html` - Create a landing page for the tool (optional, or just use README)
- `.github/workflows/deploy.yml` - GitHub Pages workflow (if creating landing page)
- `.github/workflows/build.yml` - Build and release workflow (optional, for binaries)

**Steps**:
1. Create repo `rynf1t/slackfmt` on GitHub
2. Copy all Go files from `slackfmt/` directory
3. Update `README.md` to change:
   - `github.com/rynf1t/site/slackfmt` → `github.com/rynf1t/slackfmt`
   - `github.com/rynf1t/site` → `github.com/rynf1t/slackfmt`
   - Update release links
4. Create `index.html` landing page (or just use README as homepage)
5. Add GitHub Pages workflow if creating landing page
6. Enable GitHub Pages in repo settings
7. Push and verify

## GitHub Pages Workflow Template

Create `.github/workflows/deploy.yml` in each tool repo:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: .
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## README Template for HTML Tools

```markdown
# Tool Name

Brief one-sentence description.

## Live Demo

[Try it here](https://tool-name.itsryan.me/)

## Usage

Instructions on how to use the tool.

## Running Locally

```bash
# Clone the repository
git clone https://github.com/rynf1t/tool-name.git
cd tool-name

# Open index.html in your browser
open index.html
```

## See Also

- [All Tools](https://itsryan.me/tools) - Browse all available tools
```

## After Migration

Once all tools are migrated:

1. Verify all tool URLs work
2. Update main site's tools list (already done in `src/pages/tools/index.astro`)
3. Remove old tool files from main repo:
   - `public/tools/*.html` (keep .md files if needed for reference)
   - `slackfmt/` directory
   - `src/pages/tools/slackfmt.astro`
   - `src/pages/tools/sqlite-csv-playground-docs.astro` (if not needed)
4. Test all links from main site's `/tools` page

## Verification Checklist

For each tool:
- [ ] Repository created
- [ ] Files copied
- [ ] GitHub Pages workflow added
- [ ] GitHub Pages enabled (Source: GitHub Actions)
- [ ] Tool deployed and accessible at `https://tool-name.itsryan.me/`
- [ ] Back link points to `https://itsryan.me/tools`
- [ ] README created with proper links
- [ ] Added to main site's tools list
- [ ] Tested link from main site
