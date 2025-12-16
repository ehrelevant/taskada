import { Controller, Get, Param } from '@nestjs/common';

import { RequestsService } from './requests.service';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get()
  async getRequests() {
    return this.requestsService.getNearbyRequests();
  }

  @Get(':id')
  async getRequestDetails(@Param('id') id: string) {
    return this.requestsService.getRequestById(id);
  }
}
