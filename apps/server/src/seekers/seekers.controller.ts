import { Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ProviderInsertSchema } from '@repo/database';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { SeekersService } from './seekers.service';

@Controller('seekers')
export class SeekersController {
  constructor(private readonly seekersService: SeekersService) {}

  @Get()
  async getSeekerForUser(@Session() { user: { id: userId } }: UserSession) {
    return await this.seekersService.getSeekerByUserId(userId);
  }

  @Post()
  @UsePipes(new ValibotPipe(ProviderInsertSchema))
  async createSeekerForUser(@Session() { user: { id: userId } }: UserSession) {
    return await this.seekersService.createSeeker(userId);
  }
}
