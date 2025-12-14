import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { ServiceInsertSchema } from '@repo/database';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { ServicesService } from './services.service';

import { CreateServiceDto } from './dto/create-service.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UsePipes(new ValibotPipe(ServiceInsertSchema))
  async createService(@Session() { user: { id: userId }}: UserSession, @Body() createServiceDto: CreateServiceDto) {
    return await this.servicesService.createService(userId, createServiceDto);
  }

  @Get('/my')
  async getAllServicesForSelf(@Session() { user: { id: userId }}: UserSession) {
    return await this.servicesService.getAllServices(userId);
  }
}
