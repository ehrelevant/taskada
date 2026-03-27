import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Session, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UserSession } from '@thallesp/nestjs-better-auth';

import { S3Service } from '../s3/s3.service';

import { ReportsService } from './reports.service';

import { CreateReportDto } from './dto/create-report.dto';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({ status: 201, description: 'Report created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or duplicate report' })
  @ApiResponse({ status: 403, description: 'User not authorized to report' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async createReport(@Session() { user }: UserSession, @Body() createReportDto: CreateReportDto) {
    return await this.reportsService.createReport(user.id, createReportDto);
  }

  @Post(':id/images')
  @ApiOperation({ summary: 'Upload evidence images for a report' })
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @ApiResponse({ status: 403, description: 'User not authorized' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadReportImages(
    @Param('id') reportId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Session() { user }: UserSession,
  ) {
    if (!files || files.length === 0) {
      return { error: 'No files provided' };
    }

    if (files.length > 4) {
      return { error: 'Maximum 4 images allowed' };
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const invalidFiles = files.filter(f => !allowedMimeTypes.includes(f.mimetype));
    if (invalidFiles.length > 0) {
      return { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' };
    }

    const uploadPromises = files.map(async file => {
      const result = await this.s3Service.uploadFile(file, `reports/${reportId}`, user.id);
      return result.key;
    });

    const imageKeys = await Promise.all(uploadPromises);

    await this.reportsService.uploadReportImages(reportId, user.id, imageKeys);

    return { imageKeys };
  }

  @Get('booking/:bookingId/check')
  @ApiOperation({ summary: 'Check if current user has already reported this booking' })
  @ApiResponse({ status: 200, description: 'Check result' })
  async checkReportExists(@Param('bookingId') bookingId: string, @Session() { user }: UserSession) {
    return await this.reportsService.checkReportExists(user.id, bookingId);
  }
}
