import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes } from '@nestjs/common';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { MatchingService } from '../matching/matching.service';

import { RequestsService } from './requests.service';

import { CreateRequestSchema } from './dto/create-request.dto';
import { CreateRequestSwaggerDto } from './dto/create-request-swagger.dto';

@Controller('requests')
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly matchingService: MatchingService,
  ) {}

  @Post()
  @UsePipes(new ValibotPipe(CreateRequestSchema))
  async createRequest(@Session() { user }: UserSession, @Body() body: CreateRequestSwaggerDto) {
    return this.requestsService.createRequest(body, user.id);
  }

  @Post(':id/images')
  async uploadRequestImages(@Param('id') id: string, @Body() body: { imageUrls: string[] }) {
    if (!body.imageUrls || !Array.isArray(body.imageUrls)) {
      return { error: 'imageUrls array is required' };
    }

    await this.requestsService.addRequestImages(id, body.imageUrls);
    return { success: true };
  }

  @Get()
  async getRequests() {
    return this.requestsService.getNearbyRequests();
  }

  @Get('pending')
  async getPendingRequests(
    @Query('serviceTypeIds') serviceTypeIdsParam?: string,
    @Query('serviceIds') serviceIdsParam?: string,
  ) {
    const serviceTypeIds = serviceTypeIdsParam ? serviceTypeIdsParam.split(',') : [];
    const serviceIds = serviceIdsParam ? serviceIdsParam.split(',') : [];

    return this.requestsService.getPendingRequests(serviceTypeIds, serviceIds);
  }

  @Get(':id')
  async getRequestDetails(@Param('id') id: string) {
    return this.requestsService.getRequestById(id);
  }

  @Delete(':id')
  async deleteRequest(@Param('id') id: string) {
    const success = await this.matchingService.deleteRequest(id);

    if (!success) {
      return { error: 'Request not found or already deleted' };
    }

    return { success: true, message: 'Request deleted successfully' };
  }

  @Patch(':id/status')
  async updateRequestStatus(@Param('id') id: string, @Body() body: { status: 'pending' | 'settling' }) {
    await this.requestsService.updateRequestStatus(id, body.status);
    return { success: true, message: `Request status updated to ${body.status}` };
  }
}
