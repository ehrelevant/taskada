import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ValibotPipe } from 'src/valibot/valibot.pipe';

import { MatchingService } from '../matching/matching.service';

import { RequestsService } from './requests.service';

import { CreateRequestSchema, UpdateRequestStatusSchema } from './dto/create-request.dto';
import { CreateRequestSwaggerDto } from './dto/create-request-swagger.dto';
import { UpdateRequestStatusSwaggerDto } from './dto/update-request-status-swagger.dto';

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
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadRequestImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      return { error: 'No files provided' };
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const invalidFiles = files.filter(f => !allowedMimeTypes.includes(f.mimetype));
    if (invalidFiles.length > 0) {
      return { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' };
    }

    await this.requestsService.uploadRequestImages(id, files);
    return { message: 'Images uploaded successfully' };
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
      throw new NotFoundException('Request not found or already deleted');
    }

    return { message: 'Request deleted successfully' };
  }

  @Patch(':id/status')
  @UsePipes(new ValibotPipe(UpdateRequestStatusSchema))
  async updateRequestStatus(@Param('id') id: string, @Body() body: UpdateRequestStatusSwaggerDto) {
    await this.requestsService.updateRequestStatus(id, body.status);
    return { message: `Request status updated to ${body.status}` };
  }
}
