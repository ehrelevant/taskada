import { Body, Controller, Get, Post } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';

import { ProvidersService } from './providers.service';

import { CreateProviderDto } from './dto/create-provider.dto';


@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get('me')
  async getProviderForUser(@Session() userSession: UserSession) {
    return await this.providersService.getProviderByUserId(userSession.user.id);
  }

  @Post()
  async createProvider(@Session() userSession: UserSession, @Body() createProviderDto: CreateProviderDto) {
    if (createProviderDto.userId !== userSession.user.id) {
      throw new Error('You can only create a provider for yourself');
    }

    return await this.providersService.createProvider(createProviderDto);
  }
}
