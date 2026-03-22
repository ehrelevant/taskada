import { cleanupOpenApiDoc } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new GlobalExceptionFilter());

  // TODO: Add CORS policy for production mode
  app.enableCors({
    origin: [
      'http://localhost:3300',
      'http://localhost:3200',
      'http://localhost:3100',
      'provider-app://',
      'seeker-app://',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder().build();
  const openApiDocument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(openApiDocument));

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
