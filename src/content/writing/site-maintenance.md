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

Tools are standalone HTML files in `public/tools/`. To add a new tool:

1. Create an HTML file in `public/tools/` (e.g., `my-tool.html`)
2. Optionally create a `.md` file with the same name (e.g., `my-tool.md`) containing a one-sentence description
3. The tool will automatically appear on the `/tools` page, sorted by creation date

The HTML file should be self-contained. Include a back link to `/tools` at the top of your tool. You can use the template in `public/tools/_template.html` as a starting point.

Tool titles are automatically generated from the filename (e.g., `my-tool.html` becomes "My Tool"). For special cases, add an override in `src/pages/tools/index.astro` in the `toolTitleOverrides` object.

To auto-generate descriptions for tools without `.md` files, run:

```bash
python3 scripts/generate-docs.py
```

This requires the `llm` CLI tool to be installed and configured.

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
- `scripts/push-tool.sh` - Push only tool changes
- `scripts/push-writing.sh` - Push only writing/blog post changes

All scripts use the unified `scripts/push.sh` under the hood. They will:
1. Check for changes in the specified directory
2. Auto-generate tool descriptions if applicable
3. Stage the changes
4. Generate a commit message using the LLM
5. Commit and push

These scripts require the `llm` CLI tool to be installed and configured.

### Generate Tool Descriptions

```bash
python3 scripts/generate-docs.py
```

Generates one-sentence descriptions for HTML tools that don't have a corresponding `.md` file. Requires the `llm` CLI tool.

### Commit with LLM

```bash
scripts/commit-with-llm.sh
```

Generates a commit message for staged changes using an LLM. Requires the `llm` CLI tool.

## Development Workflow

1. Make your changes (add tools, write posts, update code)
2. Test locally with `npm run dev`
3. Use the appropriate push script to commit and push:
   - `./scripts/push-tool.sh` for tool changes
   - `./scripts/push-writing.sh` for blog post changes
   - `./scripts/push-site.sh` for everything else
4. The site will rebuild automatically on push (if using a CI/CD setup)

## Project Structure

- `public/tools/` - Standalone HTML tools
- `src/content/writing/` - Blog posts (markdown)
- `src/content/pages/` - Static pages (markdown)
- `src/pages/` - Astro pages and routes
- `src/components/` - Reusable Astro components
- `src/layouts/` - Page layouts
- `src/utils/` - Utility functions (date, format, TOC)
- `scripts/` - Helper scripts for development

## Utilities

The codebase includes utility functions in `src/utils/`:

- `date.ts` - File date handling with fallbacks
- `format.ts` - Title and slug formatting
- `toc.ts` - Table of contents generation and heading ID processing

These utilities are used throughout the site to reduce duplication and simplify maintenance.

