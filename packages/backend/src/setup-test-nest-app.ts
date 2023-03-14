import { INestApplication, ValidationPipe } from '@nestjs/common';

import { mockAuthenticationMiddleware } from './config/mockAuthenticationMiddleware';

export const setupTestNestApp = (app: INestApplication) => {
  app.use(mockAuthenticationMiddleware);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
};
