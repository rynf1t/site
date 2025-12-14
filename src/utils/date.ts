import { stat } from 'node:fs/promises';

/**
 * Get file date with fallback logic.
 * Uses birthtime (creation date) if available, otherwise falls back to mtime (modification date).
 * Returns epoch date if file cannot be accessed.
 */
export async function getFileDate(filePath: string): Promise<Date> {
  try {
    const stats = await stat(filePath);
    // Use birthtime if available (creation date), otherwise fall back to mtime (modification date)
    // On some systems birthtime might not be available
    if (stats.birthtime && stats.birthtime.getTime() > 0) {
      return stats.birthtime;
    } else if (stats.mtime && stats.mtime.getTime() > 0) {
      return stats.mtime;
    }
    return new Date(0);
  } catch {
    // File not found or cannot be accessed, return epoch
    return new Date(0);
  }
}

