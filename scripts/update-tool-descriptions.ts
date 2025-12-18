import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const TOOLS_DIR = join(process.cwd(), 'static/tools');

async function getLLMDescription(content: string): Promise<string> {
    const prompt = `Based on the following HTML tool code, generate a concise, one-sentence SEO-friendly description for the tool. Focus on what it does and who it's for. Return ONLY the description text.\n\nCode snippet (first 2000 chars):\n${content.slice(0, 2000)}`;

    const result = spawnSync('llm', [prompt]);
    if (result.status === 0) {
        return result.stdout.toString().trim().replace(/^"|"$/g, '');
    }
    return '';
}

async function updateTools() {
    console.log('🔍 Checking tools for missing descriptions...');
    const files = await readdir(TOOLS_DIR);
    const htmlFiles = files.filter(f => f.endsWith('.html'));

    for (const file of htmlFiles) {
        console.log(`📄 Processing ${file}...`);
        const filePath = join(TOOLS_DIR, file);
        const content = await readFile(filePath, 'utf-8');

        // Check if description exists and is not generic
        const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
        const hasDescription = !!(descMatch && descMatch[1].trim().length > 0);
        console.log(`  - Has description: ${hasDescription}`);

        if (!hasDescription) {
            console.log(`✨ Generating description for ${file}...`);
            const description = await getLLMDescription(content);
            if (description) {
                let updatedContent;
                if (descMatch) {
                    // Update existing empty description
                    updatedContent = content.replace(
                        /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i,
                        `<meta name="description" content="${description}"`
                    );
                } else {
                    // Insert new description meta tag before </head>
                    updatedContent = content.replace('</head>', `    <meta name="description" content="${description}">\n</head>`);
                }
                await writeFile(filePath, updatedContent);
                console.log(`✅ Updated ${file}`);
            }
        }
    }
}

updateTools().catch(console.error);
