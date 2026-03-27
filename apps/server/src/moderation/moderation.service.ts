import { and, count, desc, eq, ilike, or, type SQLWrapper, sql } from 'drizzle-orm';
import { AuditAction, auditLog, booking, moderationNote, report, reportImage, user, userRole } from '@repo/database';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class ModerationService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly s3Service: S3Service,
  ) {}

  async getDashboardStats() {
    const rows = await this.dbService.db
      .select({ status: report.status, count: count() })
      .from(report)
      .groupBy(report.status);

    const stats = { open: 0, under_review: 0, resolved: 0, dismissed: 0, total: 0 };
    for (const row of rows) {
      stats[row.status] = Number(row.count);
      stats.total += Number(row.count);
    }

    return stats;
  }

  async getReports(params: { status?: string; page?: number; limit?: number; search?: string }) {
    const { status, page = 1, limit = 10, search } = params;
    const offset = (page - 1) * limit;

    const conditions: SQLWrapper[] = [];
    if (status && status !== 'all') {
      conditions.push(eq(report.status, status as 'open' | 'under_review' | 'resolved' | 'dismissed'));
    }
    if (search) {
      conditions.push(or(ilike(report.description, `%${search}%`), ilike(report.id, `%${search}%`))!);
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, [{ total }]] = await Promise.all([
      this.dbService.db
        .select({
          id: report.id,
          reporterUserId: report.reporterUserId,
          reportedUserId: report.reportedUserId,
          bookingId: report.bookingId,
          reason: report.reason,
          description: report.description,
          status: report.status,
          createdAt: report.createdAt,
          updatedAt: report.updatedAt,
          resolvedAt: report.resolvedAt,
          resolvedBy: report.resolvedBy,
          reporterFirstName: sql<string>`rpt.first_name`,
          reporterLastName: sql<string>`rpt.last_name`,
          reportedFirstName: sql<string>`rpd.first_name`,
          reportedLastName: sql<string>`rpd.last_name`,
        })
        .from(report)
        .leftJoin(sql`${user} AS rpt`, eq(report.reporterUserId, sql`rpt.id`))
        .leftJoin(sql`${user} AS rpd`, eq(report.reportedUserId, sql`rpd.id`))
        .where(where)
        .orderBy(desc(report.createdAt))
        .limit(limit)
        .offset(offset),
      this.dbService.db.select({ total: count() }).from(report).where(where),
    ]);

    return {
      data: rows.map(r => ({
        ...r,
        reporterName: [r.reporterFirstName, r.reporterLastName].filter(Boolean).join(' '),
        reportedName: [r.reportedFirstName, r.reportedLastName].filter(Boolean).join(' '),
      })),
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    };
  }

  async getReportById(reportId: string) {
    const [row] = await this.dbService.db
      .select({
        id: report.id,
        reporterUserId: report.reporterUserId,
        reportedUserId: report.reportedUserId,
        bookingId: report.bookingId,
        reason: report.reason,
        description: report.description,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        resolvedAt: report.resolvedAt,
        resolvedBy: report.resolvedBy,
        reporterFirstName: sql<string>`rpt.first_name`,
        reporterLastName: sql<string>`rpt.last_name`,
        reporterEmail: sql<string>`rpt.email`,
        reportedFirstName: sql<string>`rpd.first_name`,
        reportedLastName: sql<string>`rpd.last_name`,
        reportedEmail: sql<string>`rpd.email`,
      })
      .from(report)
      .leftJoin(sql`${user} AS rpt`, eq(report.reporterUserId, sql`rpt.id`))
      .leftJoin(sql`${user} AS rpd`, eq(report.reportedUserId, sql`rpd.id`))
      .where(eq(report.id, reportId))
      .limit(1);

    if (!row) {
      throw new NotFoundException('Report not found');
    }

    // Fetch images
    const images = await this.dbService.db
      .select({ id: reportImage.id, image: reportImage.image })
      .from(reportImage)
      .where(eq(reportImage.reportId, reportId));

    // Sign image URLs
    const signedImages = await Promise.all(
      images.map(async img => ({
        ...img,
        url: await this.s3Service.getSignedUrl(img.image).catch(() => null),
      })),
    );

    // Fetch booking details
    const [bookingRow] = await this.dbService.db
      .select({
        id: booking.id,
        status: booking.status,
        cost: booking.cost,
        createdAt: booking.createdAt,
        specifications: booking.specifications,
      })
      .from(booking)
      .where(eq(booking.id, row.bookingId))
      .limit(1);

    return {
      ...row,
      reporterName: [row.reporterFirstName, row.reporterLastName].filter(Boolean).join(' '),
      reportedName: [row.reportedFirstName, row.reportedLastName].filter(Boolean).join(' '),
      images: signedImages,
      booking: bookingRow ?? null,
    };
  }

  async updateReportStatus(
    reportId: string,
    moderatorId: string,
    status: 'open' | 'under_review' | 'resolved' | 'dismissed',
    notes?: string,
  ) {
    const [existing] = await this.dbService.db
      .select({ id: report.id, status: report.status })
      .from(report)
      .where(eq(report.id, reportId))
      .limit(1);

    if (!existing) {
      throw new NotFoundException('Report not found');
    }

    const updateData: {
      status: typeof status;
      updatedAt: Date;
      resolvedAt?: Date | null;
      resolvedBy?: string;
    } = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'resolved' || status === 'dismissed') {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = moderatorId;
    }

    await this.dbService.db.update(report).set(updateData).where(eq(report.id, reportId));

    // Create audit entry
    const auditDetails: Record<string, string> = {
      open: 'Status changed to open',
      under_review: 'Status changed to under review',
      resolved: 'Report resolved',
      dismissed: 'Report dismissed',
    };

    const actionMap: Record<string, AuditAction> = {
      open: 'status_changed',
      under_review: 'status_changed',
      resolved: 'resolved',
      dismissed: 'dismissed',
    };

    await this.dbService.db.insert(auditLog).values({
      reportId,
      moderatorId,
      action: actionMap[status],
      details: notes ? `${auditDetails[status]}: ${notes}` : auditDetails[status],
    });

    // If notes provided, also create a moderation note
    if (notes) {
      await this.dbService.db.insert(moderationNote).values({
        reportId,
        authorId: moderatorId,
        content: notes,
      });
    }

    return { success: true };
  }

  async getNotes(reportId: string) {
    const rows = await this.dbService.db
      .select({
        id: moderationNote.id,
        reportId: moderationNote.reportId,
        authorId: moderationNote.authorId,
        content: moderationNote.content,
        createdAt: moderationNote.createdAt,
        authorFirstName: user.firstName,
        authorLastName: user.lastName,
      })
      .from(moderationNote)
      .leftJoin(user, eq(moderationNote.authorId, user.id))
      .where(eq(moderationNote.reportId, reportId))
      .orderBy(moderationNote.createdAt);

    return rows.map(r => ({
      ...r,
      authorName: [r.authorFirstName, r.authorLastName].filter(Boolean).join(' '),
    }));
  }

  async createNote(reportId: string, authorId: string, content: string) {
    const [existing] = await this.dbService.db
      .select({ id: report.id })
      .from(report)
      .where(eq(report.id, reportId))
      .limit(1);

    if (!existing) {
      throw new NotFoundException('Report not found');
    }

    const [note] = await this.dbService.db.insert(moderationNote).values({ reportId, authorId, content }).returning();

    // Create audit entry
    await this.dbService.db.insert(auditLog).values({
      reportId,
      moderatorId: authorId,
      action: 'note_added' as AuditAction,
      details: 'Moderator added internal note',
    });

    return note;
  }

  async getAuditLog(params: { page?: number; limit?: number; search?: string; reportId?: string }) {
    const { page = 1, limit = 15, search, reportId: filterReportId } = params;
    const offset = (page - 1) * limit;

    const conditions: SQLWrapper[] = [];
    if (filterReportId) {
      conditions.push(eq(auditLog.reportId, filterReportId));
    }
    if (search) {
      conditions.push(
        or(
          ilike(auditLog.details, `%${search}%`),
          ilike(auditLog.id, `%${search}%`),
          ilike(auditLog.reportId, `%${search}%`),
        )!,
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, [{ total }]] = await Promise.all([
      this.dbService.db
        .select({
          id: auditLog.id,
          reportId: auditLog.reportId,
          moderatorId: auditLog.moderatorId,
          action: auditLog.action,
          details: auditLog.details,
          createdAt: auditLog.createdAt,
          moderatorFirstName: user.firstName,
          moderatorLastName: user.lastName,
        })
        .from(auditLog)
        .leftJoin(user, eq(auditLog.moderatorId, user.id))
        .where(where)
        .orderBy(desc(auditLog.createdAt))
        .limit(limit)
        .offset(offset),
      this.dbService.db.select({ total: count() }).from(auditLog).where(where),
    ]);

    return {
      data: rows.map(r => ({
        ...r,
        moderatorName: [r.moderatorFirstName, r.moderatorLastName].filter(Boolean).join(' '),
      })),
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    };
  }

  async getUsers(params: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = params;
    const offset = (page - 1) * limit;

    const conditions: SQLWrapper[] = [];
    if (search) {
      conditions.push(
        or(
          ilike(user.firstName, `%${search}%`),
          ilike(user.lastName, `%${search}%`),
          ilike(user.email, `%${search}%`),
          ilike(user.id, `%${search}%`),
        )!,
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, [{ total }]] = await Promise.all([
      this.dbService.db
        .select({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          avatarUrl: user.avatarUrl,
          banStatus: user.banStatus,
          warningsCount: user.warningsCount,
          suspendedUntil: user.suspendedUntil,
          createdAt: user.createdAt,
          role: userRole.role,
        })
        .from(user)
        .leftJoin(userRole, eq(user.id, userRole.userId))
        .where(where)
        .orderBy(desc(user.createdAt))
        .limit(limit)
        .offset(offset),
      this.dbService.db.select({ total: count() }).from(user).where(where),
    ]);

    return {
      data: rows,
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    };
  }

  async getUserById(userId: string) {
    const [row] = await this.dbService.db
      .select({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
        banStatus: user.banStatus,
        warningsCount: user.warningsCount,
        suspendedUntil: user.suspendedUntil,
        createdAt: user.createdAt,
        role: userRole.role,
      })
      .from(user)
      .leftJoin(userRole, eq(user.id, userRole.userId))
      .where(eq(user.id, userId))
      .limit(1);

    if (!row) {
      throw new NotFoundException('User not found');
    }

    return row;
  }

  async getUserReports(userId: string) {
    const rows = await this.dbService.db
      .select({
        id: report.id,
        reporterUserId: report.reporterUserId,
        reportedUserId: report.reportedUserId,
        bookingId: report.bookingId,
        reason: report.reason,
        description: report.description,
        status: report.status,
        createdAt: report.createdAt,
        updatedAt: report.updatedAt,
        reporterFirstName: sql<string>`rpt.first_name`,
        reporterLastName: sql<string>`rpt.last_name`,
        reportedFirstName: sql<string>`rpd.first_name`,
        reportedLastName: sql<string>`rpd.last_name`,
      })
      .from(report)
      .leftJoin(sql`${user} AS rpt`, eq(report.reporterUserId, sql`rpt.id`))
      .leftJoin(sql`${user} AS rpd`, eq(report.reportedUserId, sql`rpd.id`))
      .where(or(eq(report.reporterUserId, userId), eq(report.reportedUserId, userId)))
      .orderBy(desc(report.createdAt));

    return rows.map(r => ({
      ...r,
      reporterName: [r.reporterFirstName, r.reporterLastName].filter(Boolean).join(' '),
      reportedName: [r.reportedFirstName, r.reportedLastName].filter(Boolean).join(' '),
    }));
  }

  async moderateUser(
    userId: string,
    moderatorId: string,
    action: 'ban' | 'suspend' | 'warn',
    durationDays?: number,
    _message?: string,
  ) {
    const [existing] = await this.dbService.db.select({ id: user.id }).from(user).where(eq(user.id, userId)).limit(1);

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    switch (action) {
      case 'ban':
        await this.dbService.db
          .update(user)
          .set({ banStatus: 'banned', updatedAt: new Date() })
          .where(eq(user.id, userId));
        break;
      case 'suspend': {
        if (!durationDays) {
          throw new BadRequestException('durationDays is required for suspend action');
        }
        const suspendedUntil = new Date();
        suspendedUntil.setDate(suspendedUntil.getDate() + durationDays);
        await this.dbService.db
          .update(user)
          .set({ banStatus: 'suspended', suspendedUntil, updatedAt: new Date() })
          .where(eq(user.id, userId));
        break;
      }
      case 'warn':
        await this.dbService.db
          .update(user)
          .set({
            warningsCount: sql`${user.warningsCount} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(user.id, userId));
        break;
    }

    return this.getUserById(userId);
  }
}
