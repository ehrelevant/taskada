import { AuthModule } from '@thallesp/nestjs-better-auth';
import { Module } from '@nestjs/common';

import { auth } from './auth';

import { DatabaseModule } from './database/database.module';
import { ProvidersModule } from './providers/providers.module';
import { ServiceTypesModule } from './service-types/service-types.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule.forRoot({ auth }),
    ProvidersModule,
    ServiceTypesModule
  ],
})
export class AppModule {}
