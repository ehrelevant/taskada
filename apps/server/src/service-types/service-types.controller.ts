import { Controller, Get, Param } from '@nestjs/common';

import { ServiceTypesService } from './service-types.service';

@Controller('service-types')
export class ServiceTypesController {
  constructor(private readonly servicesService: ServiceTypesService) {}

  @Get(':id')
  async getServiceType(@Param('id') id: string) {
    return await this.servicesService.getServiceTypeById(id);
  }

  @Get()
  async getAllServiceTypes() {
    return await this.servicesService.getAllServiceTypes();
  }
}
