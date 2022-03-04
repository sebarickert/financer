import { memoryDatabaseServer } from '../config/MemoryDatabaseServer';

// eslint-disable-next-line import/no-default-export
export default async (): Promise<void> => memoryDatabaseServer.start();
