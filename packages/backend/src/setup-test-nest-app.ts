import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { mockAuthenticationMiddleware } from './config/mockAuthenticationMiddleware';

export const setupTestNestApp = (app: NestExpressApplication) => {
  app.use(mockAuthenticationMiddleware);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
};
