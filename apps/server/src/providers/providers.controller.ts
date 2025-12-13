import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';

import { ProvidersService } from './providers.service';

import { CreateProviderDto } from './dto/create-provider.dto';


@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  async getProviderForUser(
    @Session() { user: { id: userId } }: UserSession,
  ) {
    return await this.providersService.getProviderByUserId(userId);
  }

  @Post()
  async createProviderForUser(
    @Session() { user: { id: userId } }: UserSession,
    @Body() createProviderDto: CreateProviderDto
  ) {
    return await this.providersService.createProvider(userId, createProviderDto);
  }

  @Put('enable')
  async enableProvider(
    @Session() { user: { id: userId } }: UserSession,
  ) {
    return await this.providersService.updateProvider(userId, { isAccepting: true });
  }

  @Put('disable')
  async disableProvider(
    @Session() { user: { id: userId } }: UserSession,
  ) {
    return await this.providersService.updateProvider(userId, { isAccepting: false });
  }
}