import { stat } from 'node:fs/promises';
import { join } from 'node:path';

export async function getFileCreationDate(filePath: string): Promise<Date> {
  const stats = await stat(filePath);
  return stats.birthtime;
}