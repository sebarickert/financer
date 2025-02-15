// IMPORTANT: instrument.ts must be imported before any other imports,
// To ensure that the application is instrumented correctly.
import './instrument';

import fs from 'fs';

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { json } from 'express';

import { AppModule } from './app.module';
import {
  isApplicationInTestMode,
  isNodeEnvInDev,
  shouldOnlyExportApiSpec,
  shouldUseInternalDockerDb,
} from './config/configuration';
import { DatabaseServer } from './config/database-server';
import { mockAuthenticationMiddleware } from './config/mockAuthenticationMiddleware';

const PORT = process.env.PORT ?? 4000;

const options: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey, methodKey) =>
    `${controllerKey.replace('Controller', '')}_${methodKey}`,
};

// eslint-disable-next-line max-statements
const bootstrap = async () => {
  if (shouldUseInternalDockerDb()) await DatabaseServer.startServer();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(json({ limit: '50mb' }));
  app.enableShutdownHooks();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  if (isApplicationInTestMode()) app.use(mockAuthenticationMiddleware);

  if (isNodeEnvInDev()) {
    const config = new DocumentBuilder()
      .setTitle('Financer')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);

    if (shouldOnlyExportApiSpec()) {
      // eslint-disable-next-line no-console
      console.log("Exporting API spec to './api-spec.json'");
      fs.writeFileSync('./api-spec.json', JSON.stringify(document));
      process.exit(0);
    }
  }

  await app.listen(PORT);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
