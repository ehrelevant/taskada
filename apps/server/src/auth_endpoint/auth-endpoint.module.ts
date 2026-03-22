import { Module } from '@nestjs/common';

import { AuthEndpointController } from './auth.controller';

@Module({
  controllers: [AuthEndpointController],
})
export class AuthEndpointModule {}
