import { Module } from '@nestjs/common';

import { MatchingGateway } from './matching.gateway';
import { MatchingService } from './matching.service';
import { WsAuthGuard } from './ws-auth.guard';

@Module({
  providers: [MatchingGateway, MatchingService, WsAuthGuard],
  exports: [MatchingGateway, MatchingService],
})
export class MatchingModule {}
