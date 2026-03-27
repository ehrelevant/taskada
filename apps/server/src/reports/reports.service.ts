import { and, eq } from 'drizzle-orm';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { booking, report, reportImage } from '@repo/database';

import { DatabaseService } from '../database/database.service';

import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly dbService: DatabaseService) {}

  async createReport(reporterUserId: string, dto: CreateReportDto) {
    const { reportedUserId, bookingId, reason, description } = dto;

    // Verify booking exists
    const [bookingRecord] = await this.dbService.db
      .select({
        providerUserId: booking.providerUserId,
        seekerUserId: booking.seekerUserId,
      })
      .from(booking)
      .where(eq(booking.id, bookingId))
      .limit(1);

    if (!bookingRecord) {
      throw new NotFoundException('Booking not found');
    }

    // Verify reporter is a participant in the booking
    if (bookingRecord.providerUserId !== reporterUserId && bookingRecord.seekerUserId !== reporterUserId) {
      throw new ForbiddenException('You are not a participant in this booking');
    }

    // Verify reported user is the other participant
    if (bookingRecord.providerUserId !== reportedUserId && bookingRecord.seekerUserId !== reportedUserId) {
      throw new BadRequestException('The reported user is not a participant in this booking');
    }

    // Verify reporter is not reporting themselves
    if (reporterUserId === reportedUserId) {
      throw new BadRequestException('You cannot report yourself');
    }

    // Check if a report already exists for this booking by this reporter
    const [existingReport] = await this.dbService.db
      .select({ id: report.id })
      .from(report)
      .where(and(eq(report.reporterUserId, reporterUserId), eq(report.bookingId, bookingId)))
      .limit(1);

    if (existingReport) {
      throw new BadRequestException('You have already submitted a report for this booking');
    }

    // Create the report
    const [newReport] = await this.dbService.db
      .insert(report)
      .values({
        reporterUserId,
        reportedUserId,
        bookingId,
        reason,
        description: description || null,
      })
      .returning();

    return newReport;
  }

  async uploadReportImages(reportId: string, reporterUserId: string, imageKeys: string[]) {
    // Verify the report exists and belongs to the reporter
    const [reportRecord] = await this.dbService.db
      .select({ id: report.id, reporterUserId: report.reporterUserId })
      .from(report)
      .where(eq(report.id, reportId))
      .limit(1);

    if (!reportRecord) {
      throw new NotFoundException('Report not found');
    }

    if (reportRecord.reporterUserId !== reporterUserId) {
      throw new ForbiddenException('You can only upload images to your own reports');
    }

    if (imageKeys.length > 0) {
      await this.dbService.db.insert(reportImage).values(
        imageKeys.map(key => ({
          reportId,
          image: key,
        })),
      );
    }
  }

  async checkReportExists(reporterUserId: string, bookingId: string) {
    const [existingReport] = await this.dbService.db
      .select({ id: report.id })
      .from(report)
      .where(and(eq(report.reporterUserId, reporterUserId), eq(report.bookingId, bookingId)))
      .limit(1);

    return { exists: !!existingReport };
  }
}
