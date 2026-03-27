import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { UserSession } from '@thallesp/nestjs-better-auth';

import { AdminGuard } from './admin.guard';
import { ModerationService } from './moderation.service';

import { CreateNoteDto } from './dto/create-note.dto';
import { ModerateUserDto } from './dto/moderate-user.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

@ApiTags('moderation')
@Controller('moderation')
@UseGuards(AdminGuard)
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get moderation dashboard stats' })
  async getDashboard() {
    return this.moderationService.getDashboardStats();
  }

  @Get('reports')
  @ApiOperation({ summary: 'List reports with filters' })
  async getReports(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.moderationService.getReports({
      status,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
    });
  }

  @Get('reports/:id')
  @ApiOperation({ summary: 'Get report detail' })
  async getReportById(@Param('id') reportId: string) {
    return this.moderationService.getReportById(reportId);
  }

  @Patch('reports/:id/status')
  @ApiOperation({ summary: 'Update report status' })
  async updateReportStatus(
    @Param('id') reportId: string,
    @Body() dto: UpdateReportStatusDto,
    @Session() { user }: UserSession,
  ) {
    return this.moderationService.updateReportStatus(reportId, user.id, dto.status, dto.notes);
  }

  @Get('reports/:id/notes')
  @ApiOperation({ summary: 'Get notes for a report' })
  async getNotes(@Param('id') reportId: string) {
    return this.moderationService.getNotes(reportId);
  }

  @Post('reports/:id/notes')
  @ApiOperation({ summary: 'Add a note to a report' })
  async createNote(@Param('id') reportId: string, @Body() dto: CreateNoteDto, @Session() { user }: UserSession) {
    return this.moderationService.createNote(reportId, user.id, dto.content);
  }

  @Get('reports/:id/audit')
  @ApiOperation({ summary: 'Get audit log for a report' })
  async getReportAudit(@Param('id') reportId: string) {
    return this.moderationService.getAuditLog({ reportId });
  }

  @Get('audit-log')
  @ApiOperation({ summary: 'Get global audit log' })
  async getAuditLog(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) {
    return this.moderationService.getAuditLog({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
    });
  }

  @Get('users')
  @ApiOperation({ summary: 'List users with filters' })
  async getUsers(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string) {
    return this.moderationService.getUsers({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search,
    });
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user detail' })
  async getUserById(@Param('id') userId: string) {
    return this.moderationService.getUserById(userId);
  }

  @Get('users/:id/reports')
  @ApiOperation({ summary: 'Get reports involving a user' })
  async getUserReports(@Param('id') userId: string) {
    return this.moderationService.getUserReports(userId);
  }

  @Post('users/:id/moderate')
  @ApiOperation({ summary: 'Ban, suspend, or warn a user' })
  async moderateUser(@Param('id') userId: string, @Body() dto: ModerateUserDto, @Session() { user }: UserSession) {
    return this.moderationService.moderateUser(userId, user.id, dto.action, dto.durationDays, dto.message);
  }
}
