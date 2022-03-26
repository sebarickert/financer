import { MongoMemoryServer } from 'mongodb-memory-server';

// Extend the default timeout so MongoDB binaries can download
// jest.setTimeout(60000);

export const memoryDatabaseServer = new MongoMemoryServer({
  binary: {
    version: '4.2.16',
  },
});

export const startMemoryDb = async (): Promise<void> => {
  console.log('starting memory db');
  return memoryDatabaseServer.start();
};

export const getMemoryDbUri = (): string => {
  return memoryDatabaseServer.getUri();
};
