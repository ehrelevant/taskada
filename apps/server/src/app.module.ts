import { AuthModule } from '@thallesp/nestjs-better-auth';
import { Module } from '@nestjs/common';

import { auth } from './auth';

import { BookingsModule } from './bookings/bookings.module';
import { DatabaseModule } from './database/database.module';
import { ProvidersModule } from './providers/providers.module';
import { RequestsModule } from './requests/requests.module';
import { ServicesModule } from './services/services.module';
import { ServiceTypesModule } from './service-types/service-types.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule.forRoot({ auth }),
    ProvidersModule,
    ServiceTypesModule,
    ServicesModule,
    RequestsModule,
    BookingsModule,
  ],
})
export class AppModule {}
