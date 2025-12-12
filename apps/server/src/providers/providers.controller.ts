import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { ProvidersService } from './providers.service';

import { CreateProviderDto } from './dto/create-provider.dto';


@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get(':userId')
  async getProviderForUser(@Param('userId') userId: string) {
    return await this.providersService.getProviderByUserId(userId);
  }

  @Post(':userId')
  async createProviderForUser(@Param('userId') userId: string, @Body() createProviderDto: CreateProviderDto) {
    if (createProviderDto.userId !== userId) {
      throw new Error('You can only create a provider for yourself');
    }

    return await this.providersService.createProvider(createProviderDto);
  }

  @Put(':userId/enable')
  async enableProvider(@Param('userId') userId: string) {
    return await this.providersService.updateProvider(userId, { isAccepting: true });
  }

  @Put(':userId/disable')
  async disableProvider(@Param('userId') userId: string) {
    return await this.providersService.updateProvider(userId, { isAccepting: false });
  }
}