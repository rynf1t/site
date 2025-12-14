# itsryan.me

Personal site with blog and tools, built with Astro.

## 🚀 Quick Start

### Write a Blog Post

```bash
# Just write! No frontmatter needed!
cat > src/content/blog/my-new-post.md << 'EOF'
This is my blog post. Just pure writing.

## Markdown works great

- Lists
- **Bold** and *italic*
- Links and more

Write whatever you want. The date is auto-added.
EOF

# Commit and push
git add src/content/blog/my-new-post.md
git commit -m "Add new blog post"
git push
```

**Optional frontmatter** (if you want a custom title/description):
```markdown
---
title: Custom Title
description: Custom description
---

Your content...
```

**That's it!** GitHub Actions will build and deploy automatically in ~2 minutes.

Your post will be live at: `https://itsryan.me/writing/my-new-post`

### Create a Tool

```bash
# Create a new HTML tool
cp public/tools/text-converter.html public/tools/my-tool.html

# Edit it with your tool code
# vim public/tools/my-tool.html

# Optional: Add a description (otherwise no description shown)
echo "Brief description of what my tool does." > public/tools/my-tool.md

# Commit and push
git add public/tools/my-tool.*
git commit -m "Add my-tool"
git push
```

**Done!** Your tool will be:
- Live at: `https://itsryan.me/tools/my-tool.html`
- **Automatically listed** at: `https://itsryan.me/tools` (no README editing needed!)

## 📁 Directory Structure

```
/
├── src/
│   ├── content/
│   │   └── blog/              # Blog posts (.md files)
│   │       ├── my-post.md     # Just add files here!
│   │       └── another.md
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   ├── writing.astro      # Blog listing (auto-generated)
│   │   ├── about.astro        # About page
│   │   └── tools/
│   │       └── index.astro    # Tools listing (auto-generated)
│   ├── layouts/
│   │   └── Layout.astro       # Main layout (Times New Roman styling)
│   └── components/
│       └── Navigation.astro   # Site navigation
├── public/
│   └── tools/                 # HTML tools (static files)
│       ├── text-converter.html
│       ├── text-converter.md  # Optional description
│       ├── python/            # Python CLI tools
│       │   └── example.py
│       └── bash/              # Bash scripts
│           └── example.sh
├── scripts/
│   └── generate-docs.py       # Optional: LLM auto-docs
└── .github/workflows/
    └── deploy.yml             # Auto-deploy on push
```

## 🎨 Styling

All pages use Times New Roman serif font with clean, minimal styling:
- Font: Times New Roman
- Colors: Black (#1a1a1a) on white
- Layout: 800px max width, centered
- Mobile responsive

Edit `src/layouts/Layout.astro` to customize.

## 🤖 Optional: LLM Auto-Documentation

Want Claude to auto-write tool descriptions?

### Setup

```bash
# Install LLM CLI
pip install llm llm-anthropic

# Set API key
llm keys set anthropic
# Paste your key from: https://console.anthropic.com/
```

### Usage

```bash
# Generate descriptions for all tools without .md files
cd /Users/ryan/Documents/blog
python scripts/generate-docs.py

# Dry run (see what would be done)
python scripts/generate-docs.py --dry-run

# Verbose output
python scripts/generate-docs.py --verbose
```

**Cost:** ~$0.01 per tool (basically free)

**Alternative:** Just write the `.md` files manually (one sentence is fine).

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Visit http://localhost:4321

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 File Naming

### Blog Posts
- File: `src/content/blog/kebab-case-name.md`
- URL: `itsryan.me/writing/kebab-case-name`

### Tools
- File: `public/tools/my-tool.html`
- URL: `itsryan.me/tools/my-tool.html`
- Description: `public/tools/my-tool.md` (optional)

## 🚢 Deployment

### GitHub Pages (Current Setup)

1. Push to `main` branch
2. GitHub Actions builds the site
3. Deploys to `itsryan.me` automatically

### Cloudflare Pages (Alternative)

If you want to switch to Cloudflare Pages:

1. Go to Cloudflare → Pages → Create project
2. Connect to GitHub → Select this repo
3. Build settings:
   - Build command: `npm run build`
   - Build output: `dist`
4. Deploy!

## 📊 What Astro Does Automatically

- ✅ Finds all blog posts in `src/content/blog/`
- ✅ Creates `/writing` page with all posts listed
- ✅ Generates individual post pages
- ✅ Finds all tools in `public/tools/`
- ✅ Creates `/tools` page with all tools listed
- ✅ Serves static HTML tools as-is (no processing)
- ✅ Handles routing automatically
- ✅ Optimizes images
- ✅ Generates sitemap
- ✅ Mobile responsive

**You just add files, Astro does the rest.**

## 🔧 Tool Templates

### HTML Tool Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Tool</title>
    <style>
        body {
            font-family: "Times New Roman", Times, serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
    </style>
</head>
<body>
    <h1>My Tool</h1>
    <p>Description of what this tool does.</p>

    <!-- Your tool UI here -->

    <script>
        // Your tool logic here
    </script>
</body>
</html>
```

### Python Tool Template

```python
#!/usr/bin/env python3
"""
Tool description.

Usage:
    uv run https://itsryan.me/tools/python/my-tool.py <args>
"""

import sys

def main():
    # Your tool logic here
    pass

if __name__ == "__main__":
    main()
```

## 💡 Tips

### Blog Posts
- Use frontmatter for metadata (title, date, description)
- Markdown supports code blocks, lists, links, images
- Posts are automatically sorted by date (newest first)

### Tools
- Each tool is a standalone HTML file (no dependencies)
- Keep tools simple and focused on one task
- Use the same styling as the main site for consistency
- Test locally before pushing (`npm run dev`)

### Python/Bash Tools
- These are CLI tools, not web tools
- Users run them with `uv run` or `curl | bash`
- Host them in `public/tools/python/` and `public/tools/bash/`

## 🎯 Examples

**Blog post:**
```markdown
---
title: My Thoughts on X
description: Some thoughts I had
pubDate: 2025-01-15
---

Here's what I think about X...
```

**Tool:**
```html
<!DOCTYPE html>
<html>
  <head><title>QR Code Generator</title></head>
  <body>
    <h1>QR Code Generator</h1>
    <input id="text" placeholder="Enter text">
    <button onclick="generate()">Generate</button>
    <div id="output"></div>
    <script>
      function generate() {
        const text = document.getElementById('text').value;
        // Generate QR code logic...
      }
    </script>
  </body>
</html>
```

## 📚 Further Reading

- [Astro Documentation](https://docs.astro.build/)
- [Markdown Guide](https://www.markdownguide.org/)
- [LLM CLI](https://llm.datasette.io/)

---

**That's it! Just add Markdown files for blog posts and HTML files for tools.**
