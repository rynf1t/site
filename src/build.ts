import { readdir, mkdir, stat } from 'node:fs/promises';
import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';
import frontMatter from 'front-matter';
import { Layout, Post, MediaPost, IndexPage, ArchivePage, MediaPage } from './components';

// --- Markdown Setup ---
const md = new MarkdownIt({
    html: true,
    typographer: true,
}).use(footnote);

// --- Sidenote Render Rules ---
// Override 'footnote_ref' to output: <label for="sn-N" class="sidenote-toggle">N</label><input ...>
md.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
    const id = slf.rules.footnote_anchor_name!(tokens, idx, options, env, slf);
    const caption = slf.rules.footnote_caption!(tokens, idx, options, env, slf);
    // We use the ID as the Checkbox ID
    return `<label for="sn-${id}" class="sidenote-toggle">${caption}</label><input type="checkbox" id="sn-${id}" class="sidenote-toggle-checkbox">`;
};

// Override 'footnote_block_open/close' to hide the bottom list (we will inject the content inline if possible, or handle it via CSS)
// Wait, the standard footnote plugin puts the *content* at the bottom of the document in a block. 
// For Sidenotes, we want the content *IMMEDIATELY AFTER* the reference in the HTML (so we can float it).
// This is tricky with standard markdown-it-footnote because it collects them for the end.
// HACK: We will let markdown-it-footnote generate the block at the end, 
// AND THEN we will Regex move the content up to the marker 🤯
// OR: We just write a simple "Inline Footnote" plugin. 
// Given the time, let's Stick to the "Bottom Footnotes" standard for now BUT styled as sidenotes? 
// No, the CSS expects them to be siblings.
// Let's use the USER'S approach: they probably use [^1] but the output is inline.
// We will write a custom Tokenizer hook or just a Regex post-processor on the Markdown before render?
// Regex on Markdown is fragile. 
// Let's use a simpler approach: Regex on the HTML output? No, the content is far away.

// BETTER APPROACH: "Inline Sidenotes" 
// We will parse `[^1]` markers, look up the `[^1]: content` definition, and INJECT it right there.
// We can do this by pre-processing the Markdown string to replace `[^1]` with the full HTML, removing the definition.

function preProcessSidenotes(markdown: string, slug: string): string {
    // 1. Extract definitions: [^1]: content
    // We match the key and the content. basic single line support for now to match user style.
    const definitions = new Map<string, string>();
    const defRegex = /^\[\^([^\s\]]+)\]:\s*(.+)$/gm;

    // We need to strip definitions from the markdown so they don't render at bottom
    // We'll rebuild the string without them
    let cleanMarkdown = markdown.replace(defRegex, (match, id, content) => {
        definitions.set(id, content);
        return '';
    });

    // 2. Replace markers: [^1] with HTML
    // We use a unique ID derived from slug + noteId to avoid collisions on index page
    const markerRegex = /\[\^([^\s\]]+)\]/g;
    return cleanMarkdown.replace(markerRegex, (match, id) => {
        const content = definitions.get(id);
        if (!content) return match; // Missing def, leave as text

        const uniqueId = `sn-${slug}-${id}`;
        return `<label for="${uniqueId}" class="sidenote-toggle">${id}</label><input type="checkbox" id="${uniqueId}" class="sidenote-toggle-checkbox"><span class="sidenote">${content}</span><label for="${uniqueId}" class="sidenote-backdrop"></label>`;
    });
}

// Wikilinks: [[Link]] -> <a href="/posts/link.html">Link</a>
md.inline.ruler.push('wikilink', (state, silent) => {
    const match = state.src.slice(state.pos).match(/^\[\[([^\]]+)\]\]/);
    if (!match) return false;
    if (!silent) {
        const token = state.push('link_open', 'a', 1);
        const label = match[1];
        const slug = label.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
        token.attrs = [['href', `/posts/${slug}.html`]];

        const textToken = state.push('text', '', 0);
        textToken.content = label;

        state.push('link_close', 'a', -1);
    }
    state.pos += match[0].length;
    return true;
});


interface PostData {
    slug: string;
    title: string;
    date: string;
    content: string;
    html: string;
    type: 'post' | 'media';
    mediaType?: 'book' | 'tv' | 'film';
    image?: string;
    author?: string;
    year?: number;
    rating?: number;
    attributes: any;
    backlinks: { title: string; url: string; context?: string }[];
}

async function build() {
    console.log('📍 Building Ryan\'s Blog...');

    const posts: PostData[] = [];
    const media: PostData[] = [];

    // Helper to load and process
    async function loadPost(path: string, type: 'post' | 'media') {
        const raw = await Bun.file(path).text();
        const { attributes, body } = frontMatter<any>(raw);

        const slug = path.split('/').pop()!.replace('.md', '');

        // Process Sidenotes (Pre-render) hierarchy
        const processedBody = preProcessSidenotes(body, slug);
        const html = md.render(processedBody);

        // Get file stats for date fallback
        const fileStats = await stat(path);
        const fileMtime = fileStats.mtime.toISOString().split('T')[0];

        // Use filename as title fallback (capitalize and replace dashes/underscores with spaces)
        const titleFromFilename = slug
            .replace(/[-_]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return {
            slug,
            title: attributes?.title || titleFromFilename,
            date: attributes?.date ? new Date(attributes.date).toISOString().split('T')[0] : fileMtime,
            content: processedBody, // Keep text for backlink search
            html,
            type,
            mediaType: attributes?.type || 'book', // default to book for backwards compat
            image: attributes?.cover || attributes?.image,
            author: attributes?.author,
            year: attributes?.year,
            rating: attributes?.rating,
            attributes: attributes || {},
            backlinks: []
        } as PostData;
    }

    // 1. Scan Posts
    const postFiles = await readdir('content/posts');
    for (const file of postFiles) {
        if (!file.endsWith('.md')) continue;
        posts.push(await loadPost(`content/posts/${file}`, 'post'));
    }

    // 2. Scan Media
    try {
        const mediaFiles = await readdir('content/Bases/Media');
        for (const file of mediaFiles) {
            if (!file.endsWith('.md')) continue;
            media.push(await loadPost(`content/Bases/Media/${file}`, 'media'));
        }
    } catch (e) { }

    const allContent = [...posts, ...media];

    // 3. Compute Backlinks
    // Naive O(N^2) scan: For each post A, check if all other posts B link to A using [[A]] or [A](...) (partial check)
    // We'll stick to Wikilinks and standard links for now.
    for (const target of allContent) {
        for (const source of allContent) {
            if (source.slug === target.slug) continue;

            // Check for [[Target Title]] or /posts/target-slug
            const wikiLinkRegex = new RegExp(`\\[\\[${target.title}\\]\\]`, 'i'); // Simple title match
            const urlLinkRegex = new RegExp(`/posts/${target.slug}`, 'i');

            if (wikiLinkRegex.test(source.content) || urlLinkRegex.test(source.html)) {
                target.backlinks.push({
                    title: source.title,
                    url: `/posts/${source.slug}.html`,
                    context: undefined // No context needed
                });
            }
        }
    }

    // 4. Generate Output
    await mkdir('dist/posts', { recursive: true });

    for (const post of allContent) {
        let postHtml: string;
        
        if (post.type === 'media') {
            postHtml = MediaPost({
                title: post.title,
                date: post.date,
                html: post.html,
                image: post.image,
                rating: post.rating,
                author: post.author,
                year: post.year,
                mediaType: post.mediaType,
                backlinks: post.backlinks
            });
        } else {
            postHtml = Post({
                title: post.title,
                date: post.date,
                html: post.html,
                backlinks: post.backlinks
            });
        }

        const finalHtml = Layout({
            title: post.title,
            content: postHtml,
            description: post.attributes.description
        });

        await Bun.write(`dist/posts/${post.slug}.html`, finalHtml);
    }

    // Generate Index
    posts.sort((a, b) => b.date.localeCompare(a.date));
    media.sort((a, b) => b.date.localeCompare(a.date));
    
    const indexContent = IndexPage({
        posts: posts.map(p => ({ title: p.title, date: p.date, url: `/posts/${p.slug}.html` })),
        media: media.slice(0, 4).map(m => ({ 
            title: m.title, 
            image: m.image, 
            url: `/posts/${m.slug}.html`,
            type: m.mediaType
        })),
        totalMedia: media.length
    });

    await Bun.write('dist/index.html', Layout({ title: 'Home', content: indexContent }));

    // Generate Media Page
    const mediaPageContent = MediaPage({
        media: media.map(m => ({
            title: m.title,
            image: m.image,
            url: `/posts/${m.slug}.html`,
            type: m.mediaType || 'book',
            author: m.author,
            year: m.year,
            rating: m.rating
        }))
    });
    await Bun.write('dist/media.html', Layout({ title: 'Media', content: mediaPageContent }));

    // Generate search index JSON
    const searchIndex = [
        ...posts.map(p => ({
            title: p.title,
            url: `/posts/${p.slug}.html`,
            type: 'post' as const,
            date: p.date
        })),
        ...media.map(m => ({
            title: m.title,
            url: `/posts/${m.slug}.html`,
            type: 'media' as const,
            mediaType: m.mediaType,
            image: m.image,
            author: m.author,
            year: m.year
        }))
    ];
    await Bun.write('dist/search.json', JSON.stringify(searchIndex, null, 2));

    // Generate Archive (also used as Writing page)
    const archiveContent = ArchivePage({
        posts: posts.map(p => ({ title: p.title, date: p.date, url: `/posts/${p.slug}.html` }))
    });
    await Bun.write('dist/archive.html', Layout({ title: 'Archive', content: archiveContent }));
    await Bun.write('dist/writing.html', Layout({ title: 'Writing', content: archiveContent }));

    // Generate Tools Page
    const toolsContent = await generateToolsPage();
    await Bun.write('dist/tools.html', Layout({ title: 'Tools', content: toolsContent }));

    // Generate About Page
    const aboutContent = await generateAboutPage();
    await Bun.write('dist/about.html', Layout({ title: 'About', content: aboutContent }));

    // Copy static tools to dist
    try {
        await mkdir('dist/tools', { recursive: true });
        const toolFiles = await readdir('static/tools');
        for (const file of toolFiles) {
            if (file.endsWith('.html')) {
                const content = await Bun.file(`static/tools/${file}`).text();
                await Bun.write(`dist/tools/${file}`, content);
            }
        }
        console.log('📦 Copied tools to dist/tools/');
    } catch (e) {
        console.log('⚠️  No tools to copy (static/tools/ not found)');
    }

    // Copy static images to dist
    try {
        await mkdir('dist/images', { recursive: true });
        const imageFiles = await readdir('static/images');
        for (const file of imageFiles) {
            if (!file.endsWith('.md')) { // Skip README
                const content = await Bun.file(`static/images/${file}`).arrayBuffer();
                await Bun.write(`dist/images/${file}`, content);
            }
        }
        console.log('📦 Copied images to dist/images/');
    } catch (e) {
        // No images yet, that's fine
    }

    // Copy static icons to dist
    try {
        await mkdir('dist/icons', { recursive: true });
        const iconFiles = await readdir('static/icons');
        for (const file of iconFiles) {
            const content = await Bun.file(`static/icons/${file}`).arrayBuffer();
            await Bun.write(`dist/icons/${file}`, content);
        }
        console.log('📦 Copied icons to dist/icons/');
    } catch (e) {
        // No icons yet, that's fine
    }

    // Copy static fonts to dist
    try {
        await mkdir('dist/fonts', { recursive: true });
        const fontFiles = await readdir('static/fonts');
        for (const file of fontFiles) {
            const content = await Bun.file(`static/fonts/${file}`).arrayBuffer();
            await Bun.write(`dist/fonts/${file}`, content);
        }
        console.log('📦 Copied fonts to dist/fonts/');
    } catch (e) {
        // No fonts yet, that's fine
    }

    console.log('✅ Build Complete!');
}

// Tools Page Generator
async function generateToolsPage(): Promise<string> {
    const toolsDir = 'static/tools';
    let htmlTools: { name: string; title: string; description: string; url: string }[] = [];

    try {
        const files = await readdir(toolsDir);
        const htmlFiles = files.filter(f => f.endsWith('.html'));

        for (const file of htmlFiles) {
            const name = file.replace('.html', '');
            const filePath = `${toolsDir}/${file}`;
            const content = await Bun.file(filePath).text();

            // Extract title from <title> tag
            const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
            const title = titleMatch ? titleMatch[1].trim() : name;

            // Extract description from <meta name="description">
            const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
            const description = descMatch ? descMatch[1].trim() : '';

            htmlTools.push({ name, title, description, url: `/tools/${file}` });
        }
    } catch (e) {
        // No tools directory yet
    }

    const toolsList = htmlTools.length > 0
        ? htmlTools.map(tool => `
            <li class="mb-3 leading-relaxed">
                <a href="${tool.url}" class="text-link font-bold no-underline hover:underline">${tool.title}</a>
                ${tool.description ? `<span class="text-text2"> — ${tool.description}</span>` : ''}
                <a href="https://github.com/rynf1t/site/blob/main/static/tools/${tool.name}.html" class="text-sm ml-2 text-link hover:underline">[code]</a>
            </li>
        `).join('')
        : '<p>No tools yet.</p>';

    return `
        <section>
            <h1 class="font-bold text-2xl mb-8">Tools</h1>
            <ul class="list-none p-0 m-0">
                ${toolsList}
            </ul>
        </section>
    `;
}

// About Page Generator
async function generateAboutPage(): Promise<string> {
    try {
        const raw = await Bun.file('content/pages/about.md').text();
        const { attributes, body } = frontMatter<any>(raw);
        const html = md.render(body);

        return `
            <article class="prose prose-stone prose-lg max-w-none">
                ${html}
            </article>
        `;
    } catch (e) {
        return '<p>About page not found.</p>';
    }
}

build();
