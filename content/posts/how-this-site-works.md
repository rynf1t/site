---
title: How This Site Works
date: 2024-05-21
description: A deep dive into the custom static site generator powering this blog, built with Bun and TypeScript.
---
I've always wanted something that I could understand completely, from start to finish. That is not necessarily the case with blogging frameworks. I wanted speed, simplicity, and zero magic.  I saw a post on such a build and was inspired almost entirely by [Justin Duke's](https://www.jmduke.com/posts/2026.html) set-up.

## The Stack

The technology choices were driven by a desire for raw speed and minimal dependencies:
* **[Bun](https://bun.sh/)**: The all-in-one JavaScript runtime. It replaces Node.js, npm, and even part of the bundler. It is fast. Absurdly fast.
* **[TypeScript](https://www.typescriptlang.org/)**: Because I still want type safety, even in a script.
* **[Tailwind CSS](https://tailwindcss.com/)**: For styling.
* **[Markdown-It](https://github.com/markdown-it/markdown-it)**: To turn words into HTML.

That's basically it. No React, no hydration, no client-side routing, no heavy JavaScript bundles sent to your browser. Just HTML and CSS.

## The Build Process

The entire build process lives in a single file: `src/build.ts`. It runs top-to-bottom in milliseconds. Here is exactly what it does:

1. **Scans Content**: It reads every `.md` file in `content/posts` and `content/media`.
2. **Parses Frontmatter**: Using `front-matter` to extract metadata like title, date, and custom fields (like ratings for my media stash).
3. **Processes Markdown**: This is where the fun happens. I run the content through `markdown-it`, but with some custom logic:
    *  **Wikilinks**: It scans for `[[Wiki Links]]` and converts them to internal anchor tags, mimicking Obsidian's linking style.
    * **References**:  It parses footnotes `[^1]` and converts them into CSS-only interactive expanded references (more on this later).
4. **Computes Backlinks**: It does a naive O(N²) scan of all posts to see who links to whom, generating the "Linked to this note" section at the bottom of pages.
	1. **Generates HTML**: It wraps the content in a simple template string (no JSX, just template literals) and writes the files to the `dist` directory.

## Speed

Because Bun is so fast and the logic is so simple, the entire site builds in a fraction of a second.

```bash
$ bun run build
📍 Building Ryan's Blog...
📦 Copied static/tools to dist/tools
📦 Copied static/images to dist/images
...
✅ Build Complete!
```

There is no "waiting for webpack to compile." There is no hot-module-reloading server that takes 10 seconds to start. I change a file, I run the script, and it is done. [^1]

[^1]: In reality, it's less than this.I use Obsidian + Git Plug-in, and so commits and pushes happen automatically. 
