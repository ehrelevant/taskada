import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { LoggerModule } from 'nestjs-pino';
import { makeHistogramProvider, PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

import { auth } from './auth';
import { create_logger } from './logger';

import { AuthEndpointModule } from './auth_endpoint/auth-endpoint.module';
import { BookingsModule } from './bookings/bookings.module';
import { ChatModule } from './chat/chat.module';
import { DatabaseModule } from './database/database.module';
import { MatchingModule } from './matching/matching.module';
import { MessagesModule } from './messages/messages.module';
import { MetricsController } from './metrics/metrics.controller';
import { MetricsMiddleware } from './metrics/metrics.middleware';
import { ModerationModule } from './moderation/moderation.module';
import { PaymentEngineModule } from './payment-engine/payment-engine.module';
import { PaymentMethodModule } from './payment_method/payment_method.module';
import { ProvidersModule } from './providers/providers.module';
import { PushNotificationsModule } from './push-notifications/push-notifications.module';
import { ReportsModule } from './reports/reports.module';
import { RequestsModule } from './requests/requests.module';
import { ReviewsModule } from './reviews/reviews.module';
import { S3Module } from './s3/s3.module';
import { SeekersModule } from './seekers/seekers.module';
import { ServicesModule } from './services/services.module';
import { ServiceTypesModule } from './service-types/service-types.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule.forRoot({ auth }),
    AuthEndpointModule,
    S3Module,
    UsersModule,
    ProvidersModule,
    SeekersModule,
    ServiceTypesModule,
    ServicesModule,
    RequestsModule,
    BookingsModule,
    MatchingModule,
    MessagesModule,
    ChatModule,
    PushNotificationsModule,
    PaymentEngineModule,
    ReviewsModule,
    PaymentMethodModule,
    ReportsModule,
    ReviewsModule,
    ModerationModule,
    LoggerModule.forRoot({
      pinoHttp: {
        logger: create_logger('Taskada/API Server', 'taskada-api-server'),
      },
    }),
    PrometheusModule.register({
      path: '/metrics',
      controller: MetricsController,
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'url', 'status'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10], // latency "buckets" - Human-Computer Interaction (HCI)
    }),
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: MetricsInterceptor,
    // },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
