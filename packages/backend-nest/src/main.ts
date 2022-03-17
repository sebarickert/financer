import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { isNodeEnvInTest } from './config/configuration';
import { startMemoryDb } from './config/memoryDatabaseServer';
import { mockAuthenticationMiddleware } from './config/mockAuthenticationMiddleware';

async function bootstrap() {
  if (isNodeEnvInTest()) await startMemoryDb();

  const app = await NestFactory.create(AppModule);
  if (isNodeEnvInTest()) app.use(mockAuthenticationMiddleware);

  await app.listen(4000);
}
bootstrap();
