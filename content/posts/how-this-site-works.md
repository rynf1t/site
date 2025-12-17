---
title: How This Site Works
date: 2024-05-21
description: A deep dive into the custom static site generator powering this blog, built with Bun and TypeScript.
---

This site is a reaction to complexity.

After years of attempting to build a site with Next.js, Gatsby, and various other "modern" frameworks to simply render a few markdown files, I decided to burn it all down. I wanted something that I could understand completely, from start to finish. I wanted speed, simplicity, and zero magic.

So, I built a custom Static Site Generator (SSG) in about 400 lines of TypeScript. Inspired almost entirely by [Justin Duke](https://www.jmduke.com/posts/2026.html). 

## The Stack

The technology choices were driven by a desire for raw speed and minimal dependencies:

*   **[Bun](https://bun.sh/)**: The all-in-one JavaScript runtime. It replaces Node.js, npm, and even part of the bundler. It is fast. Absurdly fast.
*   **[TypeScript](https://www.typescriptlang.org/)**: Because I still want type safety, even in a script.
*   **[Tailwind CSS](https://tailwindcss.com/)**: For styling. I know, I said "minimal," but the utility-first approach lets me iterate on the design (like this Mac OS 9 theme) without fighting global CSS specificity wars.
*   **[Markdown-It](https://github.com/markdown-it/markdown-it)**: To turn words into HTML.

That's basically it. No React, no hydration, no client-side routing, no heavy JavaScript bundles sent to your browser. Just HTML and CSS.

## The Build Process

The entire build process lives in a single file: `src/build.ts`. It runs top-to-bottom in milliseconds. Here is exactly what it does:

1.  **Scans Content**: It reads every `.md` file in `content/posts` and `content/media`.
2.  **Parses Frontmatter**: Using `front-matter` to extract metadata like title, date, and custom fields (like ratings for my media stash).
3.  **Processes Markdown**: This is where the fun happens. I run the content through `markdown-it`, but with some custom logic:
    *   **Wikilinks**: It scans for `[[Wiki Links]]` and converts them to internal anchor tags, mimicking Obsidian's linking style.
    *   **Sidenotes**: It parses footnotes `[^1]` and converts them into CSS-only interactive sidenotes (more on this later).
4.  **Computes Backlinks**: It does a naive O(N²) scan of all posts to see who links to whom, generating the "Linked to this note" section at the bottom of pages.
5.  **Generates HTML**: It wraps the content in a simple template string (no JSX, just template literals) and writes the files to the `dist` directory.

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

There is no "waiting for webpack to compile." There is no hot-module-reloading server that takes 10 seconds to start. I change a file, I run the script, and it is done.

## Cool Features

Despite the simplicity, I didn't want to compromise on the reading experience.

### CSS-Only Sidenotes

I love the sidenote aesthetic (popularized by Tufte CSS). Most implementations require JavaScript to toggle them on mobile. I used the "checkbox hack" instead.

```html
<label for="sn-1" class="sidenote-toggle">1</label>
<input type="checkbox" id="sn-1" class="sidenote-toggle-checkbox">
<span class="sidenote">This is the note content.</span>
```

In `input.css`, I have rules that say "when this checkbox is checked, show the adjacent span." It works perfectly without a single line of client-side JS.

### Client-Side Search

I didn't want to run a server for search (Algolia, Elasticsearch, etc.). So, during the build, I generate a `search.json` file containing the title and basic metadata of every post. The client fetches this lightweight JSON file (~10KB) once, and all searching happens instantly in your browser using a simple filter function.

## The Aesthetic

The design is a love letter to **Mac OS 9**. I missed the platinum interfaces, the bevels, and the pinstripes.

I implemented this using extensive CSS variables (`--color-bg`, `--color-window`, etc.) defined in Tailwind's base layer. This allows me to switch themes (light/dark) by simply changing the data-attribute on the HTML tag, and every component updates instantly.

The "window" container you're reading this in? It has a `box-shadow` carefully tuned to look like a floating OS window. The scrollbars? Custom WebKit pseudo-elements to match the retro look.

## Why?

We've over-engineered everything. Sometimes, you just need a loop that reads a file and writes an HTML string.

You can view the full source code for this site [on GitHub](https://github.com/rynf1t/site).
