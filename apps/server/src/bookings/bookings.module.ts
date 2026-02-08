import { Module } from '@nestjs/common';

import { ChatModule } from '../chat/chat.module';
import { DatabaseModule } from '../database/database.module';
import { MatchingModule } from '../matching/matching.module';

import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [DatabaseModule, ChatModule, MatchingModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
