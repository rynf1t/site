## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Adding a Tool

Tools are now isolated in their own GitHub repositories. Each tool has its own repo and is hosted separately on GitHub Pages.

To add a new tool:

1. Follow the instructions in `TOOL_TEMPLATE.md` to create a new tool repository
2. Create the tool repository on GitHub (e.g., `rynf1t/tool-name`)
3. Set up the tool with GitHub Pages deployment
4. Add the tool to the main site's tools list in `src/pages/tools/index.astro`

See `TOOL_TEMPLATE.md` for detailed step-by-step instructions and templates.

## Adding a Blog Post

Blog posts are markdown files in `src/content/writing/`. To add a new post:

1. Create a markdown file in `src/content/writing/` (e.g., `my-post.md`)
2. The filename (without extension) becomes the URL slug (e.g., `my-post.md` → `/writing/my-post`)
3. Optionally add frontmatter:

```markdown
---
description: A brief description of the post
pubDate: 2024-01-01
---
```

If you don't specify `pubDate`, the file's creation date will be used. The post will automatically appear on the `/writing` page, sorted by date (newest first).

Posts with h2 and h3 headings will automatically get a table of contents.

## Scripts

### Push Scripts

The site includes several push scripts that automatically generate commit messages using an LLM:

- `scripts/push-site.sh` - Push all changes
- `scripts/push-writing.sh` - Push only writing/blog post changes

All scripts use the unified `scripts/push.sh` under the hood. They will:
1. Check for changes in the specified directory
2. Stage the changes
3. Generate a commit message using the LLM
4. Commit and push

These scripts require the `llm` CLI tool to be installed and configured.

**Note:** Tools are now in separate repositories, so `push-tool.sh` is no longer used for the main site.

### Commit with LLM

```bash
scripts/commit-with-llm.sh
```

Generates a commit message for staged changes using an LLM. Requires the `llm` CLI tool.

## Development Workflow

1. Make your changes (write posts, update code)
2. Test locally with `npm run dev`
3. Use the appropriate push script to commit and push:
   - `./scripts/push-writing.sh` for blog post changes
   - `./scripts/push-site.sh` for everything else
4. The site will rebuild automatically on push (if using a CI/CD setup)

**Note:** Tools are developed in their own repositories. See `TOOL_TEMPLATE.md` for creating new tools.

## Project Structure

- `src/pages/tools/` - Tools directory page (links to external tool repos)
- `src/content/writing/` - Blog posts (markdown)
- `src/content/pages/` - Static pages (markdown)
- `src/pages/` - Astro pages and routes
- `src/components/` - Reusable Astro components
- `src/layouts/` - Page layouts
- `src/utils/` - Utility functions (date, format, TOC)
- `scripts/` - Helper scripts for development
- `TOOL_TEMPLATE.md` - Instructions for creating new tools
- `MIGRATION_GUIDE.md` - Guide for migrating tools to separate repos

## Utilities

The codebase includes utility functions in `src/utils/`:

- `date.ts` - File date handling with fallbacks
- `format.ts` - Title and slug formatting
- `toc.ts` - Table of contents generation and heading ID processing

These utilities are used throughout the site to reduce duplication and simplify maintenance.

