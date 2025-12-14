import { describe, it, expect } from 'vitest';
import { slugToTitle, formatToolTitle } from '../format';

describe('slugToTitle', () => {
  it('converts simple slug to title', () => {
    expect(slugToTitle('hello-world')).toBe('Hello World');
  });

  it('converts single word slug', () => {
    expect(slugToTitle('hello')).toBe('Hello');
  });

  it('handles multiple words', () => {
    expect(slugToTitle('test-local-post')).toBe('Test Local Post');
  });

  it('handles empty string', () => {
    expect(slugToTitle('')).toBe('');
  });
});

describe('formatToolTitle', () => {
  it('formats tool name to title by default', () => {
    expect(formatToolTitle('coin-flip')).toBe('Coin Flip');
  });

  it('uses override when provided', () => {
    const overrides = {
      'sqlite-csv-playground': 'SQLite CSV Playground Pro',
    };
    expect(formatToolTitle('sqlite-csv-playground', overrides)).toBe('SQLite CSV Playground Pro');
  });

  it('falls back to default when no override exists', () => {
    const overrides = {
      'other-tool': 'Other Tool Name',
    };
    expect(formatToolTitle('coin-flip', overrides)).toBe('Coin Flip');
  });

  it('works without overrides', () => {
    expect(formatToolTitle('my-tool')).toBe('My Tool');
  });
});

