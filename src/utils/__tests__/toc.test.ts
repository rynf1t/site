import { describe, it, expect } from 'vitest';
import { generateTOC, addHeadingIds } from '../toc';

describe('generateTOC', () => {
  it('extracts h2 headings', () => {
    const markdown = `# Title

## First Section

Some content

## Second Section

More content`;
    const toc = generateTOC(markdown);
    expect(toc).toHaveLength(2);
    expect(toc[0]).toEqual({ level: 2, text: 'First Section', id: 'first-section' });
    expect(toc[1]).toEqual({ level: 2, text: 'Second Section', id: 'second-section' });
  });

  it('extracts h3 headings', () => {
    const markdown = `## Main Section

### Subsection One

### Subsection Two`;
    const toc = generateTOC(markdown);
    expect(toc).toHaveLength(3);
    expect(toc[0]).toEqual({ level: 2, text: 'Main Section', id: 'main-section' });
    expect(toc[1]).toEqual({ level: 3, text: 'Subsection One', id: 'subsection-one' });
    expect(toc[2]).toEqual({ level: 3, text: 'Subsection Two', id: 'subsection-two' });
  });

  it('generates URL-friendly IDs', () => {
    const markdown = `## Section With Special Characters!`;
    const toc = generateTOC(markdown);
    expect(toc[0].id).toBe('section-with-special-characters');
  });

  it('handles empty markdown', () => {
    const toc = generateTOC('');
    expect(toc).toHaveLength(0);
  });

  it('ignores h1 headings', () => {
    const markdown = `# Title

## Section`;
    const toc = generateTOC(markdown);
    expect(toc).toHaveLength(1);
    expect(toc[0].level).toBe(2);
  });
});

describe('addHeadingIds', () => {
  it('adds IDs to h2 headings', () => {
    const html = '<h2>Test Section</h2>';
    const toc = [{ level: 2, text: 'Test Section', id: 'test-section' }];
    const result = addHeadingIds(html, toc);
    expect(result).toContain('id="test-section"');
    expect(result).toContain('back-to-toc');
  });

  it('adds IDs to h3 headings', () => {
    const html = '<h3>Subsection</h3>';
    const toc = [{ level: 3, text: 'Subsection', id: 'subsection' }];
    const result = addHeadingIds(html, toc);
    expect(result).toContain('id="subsection"');
    expect(result).toContain('back-to-toc');
  });

  it('preserves existing IDs', () => {
    const html = '<h2 id="existing-id">Test Section</h2>';
    const toc = [{ level: 2, text: 'Test Section', id: 'test-section' }];
    const result = addHeadingIds(html, toc);
    expect(result).toContain('id="existing-id"');
    expect(result).not.toContain('id="test-section"');
  });

  it('handles empty TOC', () => {
    const html = '<h2>Test</h2>';
    const result = addHeadingIds(html, []);
    expect(result).toBe(html);
  });
});

