import { readFileSync } from 'fs';

import { config, parse } from 'dotenv';

import { fileExists } from '../utils/fileExists';

config();

const localConfigExists = fileExists('.env.local');

if (localConfigExists) {
  const localConfig = parse(readFileSync('.env.local'));

  Object.entries(localConfig).forEach(([key, value]) => {
    process.env[key] = value;
  });
}
