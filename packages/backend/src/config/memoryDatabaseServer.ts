import { execSync } from 'child_process';

import { MongoMemoryReplSet } from 'mongodb-memory-server';

// Extend the default timeout so MongoDB binaries can download
// jest.setTimeout(60000);

let replSet: MongoMemoryReplSet;

const getDbUri = () => replSet.getUri(`financer_test`);

export const setupMemoryDbSchema = (rawUri: string): string => {
  const uri = new URL(rawUri);
  uri.pathname = `${uri.pathname}_${process.pid}`;

  const setupEnvValue = process.env[`MEMORY_DB_SETUP_DONE_${process.pid}`];

  // Db schema has already been setup
  if (setupEnvValue === 'true') {
    return uri.toString();
  }

  process.env[`MEMORY_DB_SETUP_DONE_${process.pid}`] = 'true';
  execSync(`npx prisma db push --schema=$SCHEMA --skip-generate`, {
    // Uncomment to see command output
    // stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: uri.toString() },
  });

  return uri.toString();
};

export const startMemoryDb = async (): Promise<MongoMemoryReplSet> => {
  console.log('Starting memory db');
  replSet = await MongoMemoryReplSet.create({
    replSet: { storageEngine: 'wiredTiger' },
    // configSettings: {
    //   getLastErrorDefaults: { w: 'majority', wtimeout: 5000 },
    // },
  });

  return replSet;
};

export const stopMemoryDb = async (): Promise<void> => {
  if (replSet) {
    console.log('Stopping memory db');
    await replSet.stop();
  } else {
    console.warn('No memory db instance running, stopping skipped');
  }
};

export const getMemoryDbUri = async (): Promise<string> => {
  if (!replSet) {
    await startMemoryDb();
  }

  return setupMemoryDbSchema(getDbUri());
};
