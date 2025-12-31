import { DatabaseModule } from 'src/database/database.module';
import { Module } from '@nestjs/common';

import { SeekersController } from './seekers.controller';
import { SeekersService } from './seekers.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SeekersController],
  providers: [SeekersService],
  exports: [SeekersService],
})
export class SeekersModule {}
