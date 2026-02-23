import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { MatchingModule } from '../matching/matching.module';
import { S3Module } from '../s3/s3.module';

import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  imports: [DatabaseModule, MatchingModule, S3Module],
  controllers: [RequestsController],
  providers: [RequestsService],
  exports: [RequestsService],
})
export class RequestsModule {}
