import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { parseSearchQuery } from 'src/utils/parse';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';

import { ServicesService } from './services.service';

import { CreateProviderServiceDto } from './dto/create-provider-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('search')
  async searchServices(@Query('query') query: string, @Query('serviceTypeId') serviceTypeId?: string) {
    const searchQuery = parseSearchQuery(query);
    return await this.servicesService.searchServices(searchQuery, serviceTypeId);
  }

  @Get('featured')
  async getFeaturedServices(@Query('limit') limit?: string) {
    return await this.servicesService.getFeaturedServices(limit ? parseInt(limit, 10) : 10);
  }

  @Get('my-services')
  async getMyServices(@Session() { user }: UserSession) {
    return await this.servicesService.getServicesByProviderId(user.id);
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return await this.servicesService.getServiceById(id);
  }

  @Get(':id/reviews')
  async getServiceReviews(@Param('id') id: string) {
    return await this.servicesService.getServiceReviews(id);
  }

  @Post()
  async createService(@Session() { user }: UserSession, @Body() createServiceDto: CreateProviderServiceDto) {
    return await this.servicesService.createService({
      ...createServiceDto,
      providerUserId: user.id,
    });
  }

  @Patch(':id')
  async updateService(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return await this.servicesService.updateService(id, updateServiceDto);
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    return await this.servicesService.deleteService(id);
  }
}
