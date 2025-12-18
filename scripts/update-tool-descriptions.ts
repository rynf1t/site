import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const TOOLS_DIR = join(process.cwd(), 'static/tools');

async function getLLMData(content: string): Promise<{ description: string; tags: string[] }> {
    const LLM_PATH = '/opt/homebrew/bin/llm';
    const prompt = `Based on the following HTML tool code, generate:
1. A concise, one-sentence SEO-friendly description.
2. 3-5 relevant technology or category tags (e.g. "JavaScript", "Utilities", "Retro").

Return your response in JSON format: {"description": "...", "tags": ["...", "..."]}

Code snippet (first 3000 chars):
${content.slice(0, 3000)}`;

    const result = spawnSync(LLM_PATH, [prompt]);
    if (result.status === 0) {
        try {
            const data = JSON.parse(result.stdout.toString().trim().replace(/```json|```/g, ''));
            return data;
        } catch (e) {
            console.error('Failed to parse LLM JSON:', result.stdout.toString());
        }
    }
    return { description: '', tags: [] };
}

async function updateTools() {
    console.log('🔍 Checking tools for missing data...');
    const files = await readdir(TOOLS_DIR);
    const htmlFiles = files.filter(f => f.endsWith('.html'));

    for (const file of htmlFiles) {
        console.log(`📄 Processing ${file}...`);
        const filePath = join(TOOLS_DIR, file);
        const content = await readFile(filePath, 'utf-8');

        const hasDescription = /<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(content);
        const hasKeywords = /<meta\s+name=["']keywords["']\s+content=["'][^"']+["']/i.test(content);

        if (!hasDescription || !hasKeywords) {
            console.log(`✨ Generating data for ${file}...`);
            const data = await getLLMData(content);
            if (data.description || data.tags.length > 0) {
                let updatedContent = content;

                // Add or update description
                if (data.description && !hasDescription) {
                    if (/<meta\s+name=["']description["']/i.test(updatedContent)) {
                        updatedContent = updatedContent.replace(
                            /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i,
                            `<meta name="description" content="${data.description}">`
                        );
                    } else {
                        updatedContent = updatedContent.replace('</head>', `    <meta name="description" content="${data.description}">\n</head>`);
                    }
                }

                // Add or update keywords
                if (data.tags.length > 0 && !hasKeywords) {
                    const keywords = data.tags.join(', ');
                    if (/<meta\s+name=["']keywords["']/i.test(updatedContent)) {
                        updatedContent = updatedContent.replace(
                            /<meta\s+name=["']keywords["']\s+content=["']([^"']*)["']/i,
                            `<meta name="keywords" content="${keywords}">`
                        );
                    } else {
                        updatedContent = updatedContent.replace('</head>', `    <meta name="keywords" content="${keywords}">\n</head>`);
                    }
                }

                await writeFile(filePath, updatedContent);
                console.log(`✅ Updated ${file}`);
            }
        }
    }
}

updateTools().catch(console.error);
