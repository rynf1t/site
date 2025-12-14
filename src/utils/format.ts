/**
 * Convert slug to title: "test-local-post" -> "Test Local Post"
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format tool name to title with optional overrides.
 * Default: "coin-flip" -> "Coin Flip"
 * With override: "sqlite-csv-playground" -> "SQLite CSV Playground Pro"
 */
export function formatToolTitle(
  name: string,
  overrides?: Record<string, string>
): string {
  if (overrides && overrides[name]) {
    return overrides[name];
  }
  return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

