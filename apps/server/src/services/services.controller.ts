import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { omit } from 'valibot';
import { parseSearchQuery } from 'src/valibot/schemas';
import { ServiceInsertSchema, ServiceUpdateSchema } from '@repo/database';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { ServicesService } from './services.service';

import { CreateServiceDto } from './dto/create-service.dto';
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
  @UsePipes(new ValibotPipe(omit(ServiceInsertSchema, ['providerUserId'])))
  async createService(@Session() { user }: UserSession, @Body() createServiceDto: CreateServiceDto) {
    return await this.servicesService.createService({
      ...createServiceDto,
      providerUserId: user.id,
    });
  }

  @Patch(':id')
  @UsePipes(new ValibotPipe(ServiceUpdateSchema))
  async updateService(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return await this.servicesService.updateService(id, updateServiceDto);
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    return await this.servicesService.deleteService(id);
  }
}
