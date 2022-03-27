import { startMemoryDb } from '../src/config/memoryDatabaseServer';

// eslint-disable-next-line import/no-default-export
export default async (): Promise<void> => startMemoryDb();
