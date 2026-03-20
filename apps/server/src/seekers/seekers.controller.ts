import { Controller, Get, Post, Session } from '@nestjs/common';
import { UserSession } from '@thallesp/nestjs-better-auth';

import { SeekersService } from './seekers.service';

@Controller('seekers')
export class SeekersController {
  constructor(private readonly seekersService: SeekersService) {}

  @Get()
  async getSeekerForUser(@Session() { user: { id: userId } }: UserSession) {
    return await this.seekersService.getSeekerByUserId(userId);
  }

  @Post()
  async createSeekerForUser(@Session() { user: { id: userId } }: UserSession) {
    return await this.seekersService.createSeeker(userId);
  }
}
