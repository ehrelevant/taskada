import { AuthModule } from '@thallesp/nestjs-better-auth';
import { Module } from '@nestjs/common';

import { auth } from './auth';

import { DatabaseModule } from './database/database.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule.forRoot({ auth }),
    ProvidersModule,
  ],
})
export class AppModule {}
