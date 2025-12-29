import { Controller, Get } from '@nestjs/common';

import { ServiceTypesService } from './service-types.service';

@Controller('service-types')
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Get()
  async getServiceTypes() {
    return await this.serviceTypesService.getAllServiceTypes();
  }
}
