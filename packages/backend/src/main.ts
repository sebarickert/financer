import fs from 'fs';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@silte/nestjs-swagger';
import { json } from 'express';

import { AppModule } from './app.module';
import {
  isNodeEnvInDev,
  isNodeEnvInTest,
  shouldOnlyExportApiSpec,
} from './config/configuration';
import { startMemoryDb } from './config/memoryDatabaseServer';
import { mockAuthenticationMiddleware } from './config/mockAuthenticationMiddleware';

const PORT = process.env.PORT || 4000;

const options: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey, methodKey) =>
    `${controllerKey.replace('Controller', '')}_${methodKey}`,
};

async function bootstrap() {
  if (isNodeEnvInTest() || shouldOnlyExportApiSpec()) await startMemoryDb();

  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '50mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  if (isNodeEnvInTest()) app.use(mockAuthenticationMiddleware);

  if (isNodeEnvInDev()) {
    const config = new DocumentBuilder()
      .setTitle('Financer')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);

    if (shouldOnlyExportApiSpec()) {
      console.log("Exporting API spec to './api-spec.json'");
      fs.writeFileSync('./api-spec.json', JSON.stringify(document));
      process.exit(0);
    }
  }

  await app.listen(PORT);
}

bootstrap();
