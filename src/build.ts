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

// --- Sidenote Processing ---
// Pre-process markdown to convert footnote syntax into inline sidenotes
function preProcessSidenotes(markdown: string, slug: string): string {
    // Regex to match code blocks and inline code to exclude them
    const codeRegex = /(```[\s\S]*?```|`[^`]*`)/g;

    // Split the markdown into parts: [text, code, text, code, ...]
    // Capturing group in split means delimiters are included in the array
    const parts = markdown.split(codeRegex);

    // 1. First Pass: Extract definitions from text parts only
    const definitions = new Map<string, string>();
    const defRegex = /^\[\^([^\s\]]+)\]:\s*(.+)$/gm;

    for (let i = 0; i < parts.length; i++) {
        // Only process text parts (even indices)
        if (i % 2 === 0) {
            parts[i] = parts[i].replace(defRegex, (match, id, content) => {
                definitions.set(id, content);
                return '';
            });
        }
    }

    // 2. Second Pass: Replace markers in text parts only
    const markerRegex = /\[\^([^\s\]]+)\]/g;
    for (let i = 0; i < parts.length; i++) {
        // Only process text parts (even indices)
        if (i % 2 === 0) {
            parts[i] = parts[i].replace(markerRegex, (match, id) => {
                const content = definitions.get(id);
                if (!content) return match;

                const uniqueId = `sn-${slug}-${id}`;
                return `<label for="${uniqueId}" class="sidenote-toggle">${id}</label><input type="checkbox" id="${uniqueId}" class="sidenote-toggle-checkbox"><span class="sidenote">${content}</span><label for="${uniqueId}" class="sidenote-backdrop"></label>`;
            });
        }
    }

    return parts.join('');
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
    console.log('Current working directory:', process.cwd());

    const posts: PostData[] = [];
    const media: PostData[] = [];

    // Helper to load and process
    async function loadPost(path: string, type: 'post' | 'media') {
        const raw = await Bun.file(path).text();
        const { attributes, body } = frontMatter<any>(raw);

        // Extract filename with original capitalization
        const filename = path.split('/').pop()!.replace('.md', '');
        const slug = filename.replace(/ /g, '-').toLowerCase();

        // Process Sidenotes (Pre-render) hierarchy
        const processedBody = preProcessSidenotes(body, slug);
        const html = md.render(processedBody);

        // Get git creation date (when file was first added)
        let fileDate: string;
        try {
            const gitDate = await Bun.$`git log --diff-filter=A --follow --format=%aI -1 -- ${path}`.text();
            fileDate = gitDate.trim() ? gitDate.trim().split('T')[0] : '';
        } catch (e) {
            fileDate = '';
        }

        // Fall back to file mtime if no git date
        if (!fileDate) {
            const fileStats = await stat(path);
            fileDate = fileStats.mtime.toISOString().split('T')[0];
        }

        // Use filename as-is for title (preserves your exact capitalization)
        const titleFromFilename = filename;

        return {
            slug,
            title: attributes?.title || titleFromFilename,
            date: attributes?.date ? new Date(attributes.date).toISOString().split('T')[0] : fileDate,
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
        const mediaFiles = await readdir('content/media');
        for (const file of mediaFiles) {
            if (!file.endsWith('.md')) continue;
            media.push(await loadPost(`content/media/${file}`, 'media'));
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

    // 4. Sort posts and media before generating
    posts.sort((a, b) => b.date.localeCompare(a.date));
    media.sort((a, b) => b.date.localeCompare(a.date));

    // 5. Generate Output
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
            // Find current post index in sorted posts array
            const currentIndex = posts.findIndex(p => p.slug === post.slug);
            const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : undefined;
            const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : undefined;

            postHtml = Post({
                title: post.title,
                date: post.date,
                html: post.html,
                backlinks: post.backlinks,
                nextPost: nextPost ? { title: nextPost.title, url: `/posts/${nextPost.slug}.html` } : undefined,
                prevPost: prevPost ? { title: prevPost.title, url: `/posts/${prevPost.slug}.html` } : undefined
            });
        }

        const finalHtml = Layout({
            title: post.title,
            content: postHtml,
            description: post.attributes.description
        });

        await Bun.write(`dist/posts/${post.slug}.html`, finalHtml);
    }

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

    // Generate custom pages from content/pages
    await generateCustomPages(posts, media);

    // Copy static files to dist
    const staticDirs = [
        { src: 'static/tools', dest: 'dist/tools', extensions: ['.html'] },
        { src: 'static/images', dest: 'dist/images', skipExtensions: ['.md'] },
        { src: 'static/icons', dest: 'dist/icons' },
        { src: 'static/fonts', dest: 'dist/fonts' }
    ];

    for (const dir of staticDirs) {
        try {
            await mkdir(dir.dest, { recursive: true });
            const files = await readdir(dir.src);

            for (const file of files) {
                // Skip files based on extension filters
                if (dir.extensions && !dir.extensions.some(ext => file.endsWith(ext))) continue;
                if (dir.skipExtensions && dir.skipExtensions.some(ext => file.endsWith(ext))) continue;

                const content = await Bun.file(`${dir.src}/${file}`).arrayBuffer();
                await Bun.write(`${dir.dest}/${file}`, content);
            }
            console.log(`📦 Copied ${dir.src} to ${dir.dest}`);
        } catch (e) {
            // Directory doesn't exist, skip silently
        }
    }

    console.log('✅ Build Complete!');
}

// Tools Page Generator
async function generateToolsPage(intro?: string): Promise<string> {
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
            ${intro ? `<div class="prose prose-stone prose-lg max-w-none mb-8">${intro}</div>` : ''}

            <div class="mb-6">
                <input 
                    type="text" 
                    id="toolSearch" 
                    placeholder="Search tools..." 
                    style="background: white; border: 2px inset #999; padding: 6px 10px; width: 100%; font-family: inherit; font-size: 14px; color: #000;"
                    autocomplete="off"
                >
            </div>

            <ul class="list-none p-0 m-0" id="toolsList">
                ${toolsList}
            </ul>
             <p id="noResults" class="hidden text-text2 text-center py-8">No tools match your search.</p>
        </section>

        <script>
            (function() {
                var searchInput = document.getElementById('toolSearch');
                var list = document.getElementById('toolsList');
                var items = list.getElementsByTagName('li');
                var noResults = document.getElementById('noResults');
                
                searchInput.addEventListener('input', function(e) {
                    var query = e.target.value.toLowerCase();
                    var visibleCount = 0;
                    
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        var text = item.textContent.toLowerCase();
                        var show = text.indexOf(query) !== -1;
                        
                        item.style.display = show ? '' : 'none';
                        if (show) visibleCount++;
                    }
                    
                    noResults.classList.toggle('hidden', visibleCount > 0);
                });
            })();
        </script>
    `;
}

// Custom Pages Generator - generates pages from content/pages/*.md
async function generateCustomPages(posts: PostData[], media: PostData[]) {
    const pagesDir = 'content/pages';

    try {
        const files = await readdir(pagesDir);

        for (const file of files) {
            if (!file.endsWith('.md')) continue;

            const pageName = file.replace('.md', '');
            const raw = await Bun.file(`${pagesDir}/${file}`).text();
            const { attributes, body } = frontMatter<any>(raw);

            let content: string;
            const htmlContent = md.render(body);

            // Special handling for specific pages
            if (pageName === 'home') {
                content = IndexPage({
                    posts: posts.slice(0, 5).map(p => ({ title: p.title, date: p.date, url: `/posts/${p.slug}.html` })),
                    media: media.slice(0, 4).map(m => ({
                        title: m.title,
                        image: m.image,
                        url: `/posts/${m.slug}.html`,
                        type: m.mediaType
                    })),
                    totalMedia: media.length,
                    intro: htmlContent
                });
            } else if (pageName === 'writing') {
                // Writing page uses archive layout
                content = ArchivePage({
                    posts: posts.map(p => ({ title: p.title, date: p.date, url: `/posts/${p.slug}.html` })),
                    intro: htmlContent
                });
            } else if (pageName === 'media') {
                // Media page uses media grid layout
                content = MediaPage({
                    media: media.map(m => ({
                        title: m.title,
                        image: m.image,
                        url: `/posts/${m.slug}.html`,
                        type: m.mediaType || 'book',
                        author: m.author,
                        year: m.year,
                        rating: m.rating
                    })),
                    intro: htmlContent
                });
            } else if (pageName === 'tools') {
                // Tools page
                content = await generateToolsPage(htmlContent);
            } else {
                // Generic page - just render markdown
                const html = md.render(body);
                content = `
                    <article class="prose prose-stone prose-lg max-w-none">
                        ${html}
                    </article>
                `;
            }

            const title = attributes?.title || pageName.charAt(0).toUpperCase() + pageName.slice(1);
            const outputFile = pageName === 'home' ? 'dist/index.html' : `dist/${pageName}.html`;

            await Bun.write(outputFile, Layout({ title, content, description: attributes?.description, currentPage: pageName }));
            console.log(`📄 Generated ${outputFile}`);
        }
    } catch (e) {
        console.log('⚠️  No custom pages found in content/pages');
    }
}

build();
