import { startMemoryDb } from '../src/config/memoryDatabaseServer';

// eslint-disable-next-line import/no-default-export
export default async (): Promise<void> => {
  const instance = await startMemoryDb();
  process.env.MEMORY_DB_URI = instance.getUri();
};
