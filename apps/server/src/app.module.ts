import { AuthModule } from '@thallesp/nestjs-better-auth';
import { Module } from '@nestjs/common';

import { auth } from './auth';

import { BookingsModule } from './bookings/bookings.module';
import { DatabaseModule } from './database/database.module';
import { MatchingModule } from './matching/matching.module';
import { ProvidersModule } from './providers/providers.module';
import { RequestsModule } from './requests/requests.module';
import { SeekersModule } from './seekers/seekers.module';
import { ServicesModule } from './services/services.module';
import { ServiceTypesModule } from './service-types/service-types.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule.forRoot({ auth }),
    UsersModule,
    ProvidersModule,
    SeekersModule,
    ServiceTypesModule,
    ServicesModule,
    RequestsModule,
    BookingsModule,
    MatchingModule,
  ],
})
export class AppModule {}
