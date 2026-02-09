import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { omit } from 'valibot';
import { SeekerInsertSchema } from '@repo/database';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { SeekersService } from './seekers.service';

import { CreateSeekerSwaggerDto } from './dto/create-seeker.dto';

@Controller('seekers')
export class SeekersController {
  constructor(private readonly seekersService: SeekersService) {}

  @Get()
  async getSeekerForUser(@Session() { user: { id: userId } }: UserSession) {
    return await this.seekersService.getSeekerByUserId(userId);
  }

  @Post()
  @UsePipes(new ValibotPipe(omit(SeekerInsertSchema, ['userId'])))
  async createSeekerForUser(
    @Session() { user: { id: userId } }: UserSession,
    @Body() _createSeekerDto: CreateSeekerSwaggerDto,
  ) {
    return await this.seekersService.createSeeker(userId);
  }
}
