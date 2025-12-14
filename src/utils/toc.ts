export interface TOCItem {
  level: number;
  text: string;
  id: string;
}

/**
 * Generate table of contents from markdown by extracting h2 and h3 headings.
 */
export function generateTOC(markdown: string): TOCItem[] {
  const lines = markdown.split('\n');
  const toc: TOCItem[] = [];
  
  lines.forEach(line => {
    const h2Match = line.match(/^## (.+)$/);
    const h3Match = line.match(/^### (.+)$/);
    
    if (h2Match) {
      const text = h2Match[1].trim();
      const id = textToId(text);
      toc.push({ level: 2, text, id });
    } else if (h3Match) {
      const text = h3Match[1].trim();
      const id = textToId(text);
      toc.push({ level: 3, text, id });
    }
  });
  
  return toc;
}

/**
 * Convert text to URL-friendly ID.
 */
function textToId(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Add IDs to headings in HTML and append back-to-TOC links.
 * Processes headings in reverse order to avoid replacing already-processed headings.
 */
export function addHeadingIds(html: string, toc: TOCItem[]): string {
  let processedHtml = html;
  
  // Process in reverse order to avoid replacing already-processed headings
  for (let i = toc.length - 1; i >= 0; i--) {
    const item = toc[i];
    const headingTag = item.level === 2 ? 'h2' : 'h3';
    
    // Escape special regex characters in the text
    const escapedText = item.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create patterns that match both the original text and potential HTML entities
    // Marked might convert apostrophes to &#39; or &apos;
    const textPatterns = [
      escapedText, // Original text
      escapedText.replace(/'/g, '(&#39;|&apos;|\')'), // Apostrophe variations
    ];
    
    // Try each pattern
    for (const textPattern of textPatterns) {
      // Create a flexible regex that matches the heading with optional whitespace
      const regex = new RegExp(`<${headingTag}([^>]*)>\\s*${textPattern}\\s*</${headingTag}>`, 'gi');
      
      if (regex.test(processedHtml)) {
        regex.lastIndex = 0; // Reset regex
        processedHtml = processedHtml.replace(regex, (match, attrs) => {
          // Only add id if it doesn't already exist
          const hasId = attrs && attrs.includes('id=');
          const idAttr = hasId ? '' : ` id="${item.id}"`;
          // Preserve existing attributes
          const finalAttrs = attrs ? attrs + idAttr : idAttr;
          return `<${headingTag}${finalAttrs}>${item.text} <a href="#toc" class="back-to-toc">↑ back to TOC</a></${headingTag}>`;
        });
        break; // Found and replaced, move to next item
      }
    }
  }
  
  return processedHtml;
}

