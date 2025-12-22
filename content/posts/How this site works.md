I wanted to understand every line of code on my site. Most frameworks are black boxes. I saw [Justin Duke's setup](https://www.jmduke.com/posts/2026.html) and thought: I can do that.

## Stack

- **[Bun](https://bun.sh/)**: Replaces Node, npm, and webpack. Fast.
- **[TypeScript](https://www.typescriptlang.org/)**: Types keep me honest.
- **[Tailwind CSS](https://tailwindcss.com/)**: For styling. Gets out of the way.
- **[Markdown-It](https://github.com/markdown-it/markdown-it)**: Markdown → HTML.

No React. No hydration. No 500kb JavaScript bundles. Just HTML and CSS.

## Build

Everything happens in `src/build.ts`. One file, top to bottom:

1. Read markdown files from `content/`
2. Extract frontmatter (title, date, ratings)
3. Process markdown with custom rules:
   - **Wikilinks**: `[[Page Name]]` becomes internal links[^1]
   - **Footnotes**: `[^1]` becomes expandable inline notes
4. Find backlinks by scanning who links to whom
5. Generate HTML using template strings
6. Write to `dist/`

That's it. No bundler, no transpiler, no magic.

## Speed

The whole site builds in under a second:

```bash
$ bun run build
📍 Building Ryan's Blog...
✅ Build Complete!
```

I edit a file, run build, it's done. No webpack. No dev server. [^2]

[^1]: Stolen from Obsidian. I write everything in Obsidian anyway.
[^2]: I use Obsidian with a Git plugin, so commits happen automatically when I save.
