import { stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { relative, resolve } from 'node:path';

const execFileAsync = promisify(execFile);

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

/**
 * Get file creation date from git (first commit date).
 * Falls back to filesystem date if git is not available or file is not tracked.
 */
export async function getGitFileDate(filePath: string): Promise<Date> {
  try {
    // Convert absolute path to relative path from repository root
    const repoRoot = process.cwd();
    const absolutePath = resolve(filePath);
    const relativePath = relative(repoRoot, absolutePath);
    
    // Get the first commit date for this file using git log
    // --diff-filter=A means "Added" (first time file was added)
    // --format=%ai gives the author date in ISO format
    // --reverse and head -1 gets the first commit
    const { stdout } = await execFileAsync('git', [
      'log',
      '--diff-filter=A',
      '--format=%ai',
      '--reverse',
      '--',
      relativePath
    ], { cwd: repoRoot });
    
    const dateStr = stdout.trim().split('\n')[0];
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime()) && date.getTime() > 0) {
        return date;
      }
    }
  } catch {
    // Git not available or file not tracked, fall back to filesystem date
  }
  
  // Fallback to filesystem date
  return getFileDate(filePath);
}

