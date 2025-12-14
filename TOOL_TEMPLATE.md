# Creating a New Tool

This guide walks you through creating a new isolated tool repository that will be linked from the main site.

## Step 1: Create the GitHub Repository

1. Go to GitHub and create a new repository (e.g., `rynf1t/tool-name`)
2. Make it public
3. Initialize with a README (optional)

## Step 2: Set Up the Repository Structure

Clone your new repo and create this structure:

```
tool-name/
├── index.html          # Your tool (main HTML file)
├── README.md           # Tool description and usage
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Pages deployment
```

## Step 3: Create the GitHub Pages Workflow

Create `.github/workflows/deploy.yml` with this content:

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

## Step 4: Create Your Tool HTML

Create `index.html` with your tool. Make sure to include:

1. **Back to Tools link** at the top:
```html
<div style="margin-bottom: 2rem;">
    <a href="https://itsryan.me/tools" style="color: #1a1a1a; text-decoration: none; border: 1px solid #ddd; padding: 0.5rem 1rem; display: inline-block; font-family: 'Times New Roman', Times, serif; transition: background-color 0.2s;" 
       onmouseover="this.style.backgroundColor='#f5f5f5'; this.style.borderColor='#1a1a1a';" 
       onmouseout="this.style.backgroundColor='transparent'; this.style.borderColor='#ddd';">
        ← Back to Tools
    </a>
</div>
```

2. Your tool content (self-contained HTML, CSS, and JavaScript)

## Step 5: Create README.md

Use this template:

```markdown
# Tool Name

Brief one-sentence description of what the tool does.

## Live Demo

[Try it here](https://tool-name.itsryan.me/)

## Usage

Instructions on how to use the tool.

## Installation / Running Locally

If applicable, instructions for running locally:

```bash
# Clone the repository
git clone https://github.com/rynf1t/tool-name.git
cd tool-name

# Open index.html in your browser
open index.html
```

## Features

- Feature 1
- Feature 2
- Feature 3

## See Also

- [All Tools](https://itsryan.me/tools) - Browse all available tools
```

## Step 6: Enable GitHub Pages

1. Go to your repository Settings
2. Navigate to Pages
3. Under "Source", select "GitHub Actions"
4. The workflow will automatically deploy on push

## Step 7: Add to Main Site

Update `src/pages/tools/index.astro` and add your tool to the `tools` array:

```javascript
{
  name: 'tool-name',
  title: 'Tool Name',
  description: 'Brief description of what the tool does',
  url: 'https://tool-name.itsryan.me/',
  repo: 'https://github.com/rynf1t/tool-name',
  type: 'html' // or 'cli' for CLI tools
}
```

## Step 8: Test

1. Push your changes to the tool repo
2. Wait for GitHub Pages to deploy (check Actions tab)
3. Visit `https://tool-name.itsryan.me/` to verify it works
4. Update the main site and test the link from `/tools` page

## Checklist

- [ ] Repository created on GitHub
- [ ] GitHub Pages workflow added
- [ ] `index.html` created with tool and back link
- [ ] `README.md` created
- [ ] GitHub Pages enabled (Source: GitHub Actions)
- [ ] Tool deployed and accessible
- [ ] Added to main site's tools list
- [ ] Tested link from main site

## Notes

- Tools should be self-contained (all CSS/JS inline or in the same repo)
- Keep tools simple and focused
- The back link should point to `https://itsryan.me/tools`
- Tool URLs follow the pattern: `https://tool-name.itsryan.me/` (with custom domain setup)
