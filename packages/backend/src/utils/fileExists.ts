import { existsSync } from 'fs';
import path from 'path';

export const fileExists = (filename: string): boolean =>
  existsSync(path.join(filename));
