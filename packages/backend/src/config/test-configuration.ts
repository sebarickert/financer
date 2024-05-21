import { setupMemoryDbSchema } from './memoryDatabaseServer';

export const testConfiguration = async () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  publicUrl: process.env.PUBLIC_URL,
  cookieKey: 'test-cookie-key',
  mongodbConnectionString: setupMemoryDbSchema(process.env.MEMORY_DB_URI),
});
