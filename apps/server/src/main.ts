import 'dotenv/config';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { setLogger } from '@repo/xendit-payment-engine';

import { AppModule } from './app.module';
import { CORS_ORIGINS } from './env';
import { create_logger } from './logger';

import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

const paymentEngineLogger = create_logger('Taskada/Xendit Payment Engine', 'xendit-payment-engine');
setLogger(paymentEngineLogger);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  app.useLogger(app.get(Logger));

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({
    origin: CORS_ORIGINS,
    credentials: true,
  });

  const config = new DocumentBuilder().setTitle('Taskada API Backend').setVersion('0.0.1').addBearerAuth().build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(documentFactory()), {
    swaggerOptions: {
      deepLinking: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
      requestSnippetsEnabled: true,
      filter: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
