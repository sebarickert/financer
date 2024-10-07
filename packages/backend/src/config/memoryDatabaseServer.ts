import { execSync } from 'child_process';

import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';

import { DUMMY_TEST_USER } from './mockAuthenticationMiddleware';

let serverStarted: null | true = null;

const containerName = 'financer-test-postgres';
const username = 'postgres';
const password = 'password';
const port = 39425;

const getDbUri = () =>
  `postgresql://${username}:${password}@localhost:${port}/testdb_${process.pid}`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isContainerRunning = (targetContainerName: string): boolean => {
  try {
    const result = execSync(
      `docker inspect -f '{{.State.Running}}' ${targetContainerName}`,
    )
      .toString()
      .trim();
    return result === 'true';
  } catch (error) {
    return false;
  }
};

const isContainerExists = (targetContainerName: string): boolean => {
  try {
    execSync(`docker inspect ${targetContainerName}`);
    return true;
  } catch (error) {
    return false;
  }
};

const removeContainer = (targetContainerName: string): void => {
  try {
    execSync(`docker rm -f ${targetContainerName}`);
  } catch (error) {
    console.warn(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      `Failed to remove container ${targetContainerName}: ${(error as any).message}`,
    );
  }
};

const createDatabaseIfNotExists = async (dbUri: string): Promise<void> => {
  const uri = new URL(dbUri);
  const dbName = uri.pathname.split('/').pop();
  uri.pathname = '/postgres';

  const client = new Client({ connectionString: uri.toString() });
  await client.connect();

  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname='${dbName}'`,
  );
  if (res.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database ${dbName} created.`);
  }

  await client.end();
};

const createTestUserIfNotExists = async (dbUri: string): Promise<void> => {
  const prisma = new PrismaClient({ datasources: { db: { url: dbUri } } });

  await prisma.user.upsert({
    where: { id: DUMMY_TEST_USER.id },
    update: {},
    create: DUMMY_TEST_USER,
  });

  await prisma.$disconnect();
};

export const setupDatabaseSchema = async (rawUri: string): Promise<string> => {
  const setupEnvValue = process.env[`MEMORY_DB_SETUP_DONE_${process.pid}`];

  // Db schema has already been setup
  if (setupEnvValue === 'true') {
    return rawUri;
  }

  // With some platforms, the memory db takes a while to start
  // and we need some additional delay before running the prisma command
  if (process.env.FINANCER_DELAY_MEMORY_DB_INIT === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  await createDatabaseIfNotExists(rawUri);

  process.env[`MEMORY_DB_SETUP_DONE_${process.pid}`] = 'true';

  await new Promise((resolve) => setTimeout(resolve, 1000));

  execSync(`npx prisma db push --schema=$SCHEMA --skip-generate`, {
    // Uncomment to see command output
    // stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: rawUri },
  });

  await createTestUserIfNotExists(rawUri);

  return rawUri;
};

const startMemoryDb = async (): Promise<void> => {
  if (!serverStarted && !isContainerRunning(containerName)) {
    console.log(`Starting PostgreSQL Docker container ${containerName}`);
    if (isContainerExists(containerName)) {
      removeContainer(containerName);
    }

    execSync(
      `docker run --name ${containerName} -e POSTGRES_USER=${username} -e POSTGRES_PASSWORD=${password} -p ${port}:5432 -d postgres`,
    );

    console.log('Waiting for PostgreSQL to be ready...');
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Adjust the sleep duration as needed
    serverStarted = true;
  }
};

// TODO should call this some point
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const stopMemoryDb = (): void => {
  if (serverStarted || isContainerRunning(containerName)) {
    console.log(`Stopping PostgreSQL Docker container ${containerName}`);
    removeContainer(containerName);
    serverStarted = null;
  }
};

export const getMemoryDbUri = async (): Promise<string> => {
  if (!serverStarted) {
    await startMemoryDb();
  }

  return setupDatabaseSchema(getDbUri());
};
