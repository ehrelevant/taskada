import {
  boolean,
  check,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgSchema,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { sql } from 'drizzle-orm';

import { user } from "./user"
import { booking } from "./booking"


const app = pgSchema('app');

export const reportStatusEnum = pgEnum('report_status', ['open', 'under_review', 'resolved', 'dismissed']);

export const reportReasonEnum = pgEnum('report_reason', [
  'harassment',
  'fraudulent_payment',
  'unfair_cancellation',
  'no_show',
  'inappropriate_behavior',
  'poor_service',
  'other',
]);

export const report = app.table(
  'report',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    reporterUserId: uuid('reporter_user_id')
      .notNull()
      .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    reportedUserId: uuid('reported_user_id')
      .notNull()
      .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    bookingId: uuid('booking_id')
      .notNull()
      .references(() => booking.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    reason: reportReasonEnum('reason').notNull(),
    description: text('description'),
    status: reportStatusEnum('status').notNull().default('open'),
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    resolvedBy: uuid('resolved_by').references(() => user.id, { onUpdate: 'cascade', onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  ({ reporterUserId, bookingId }) => [unique('report_unique_reporter_booking').on(reporterUserId, bookingId)],
);
export const ReportSelectSchema = createSelectSchema(report);
export const ReportInsertSchema = createInsertSchema(report).omit({ id: true, createdAt: true, updatedAt: true });
export const ReportUpdateSchema = createUpdateSchema(report).omit({ id: true, createdAt: true, updatedAt: true });

export const reportImage = app.table('report_image', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  reportId: uuid('report_id')
    .notNull()
    .references(() => report.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  image: text('image').notNull(),
});

export const ReportImageSelectSchema = createSelectSchema(reportImage);
export const ReportImageInsertSchema = createInsertSchema(reportImage).omit({ id: true });
export const ReportImageUpdateSchema = createUpdateSchema(reportImage).omit({ id: true });

export const moderationNote = app.table('moderation_note', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  reportId: uuid('report_id')
    .notNull()
    .references(() => report.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  authorId: uuid('author_id')
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const ModerationNoteSelectSchema = createSelectSchema(moderationNote);
export const ModerationNoteInsertSchema = createInsertSchema(moderationNote).omit({ id: true, createdAt: true });
export const ModerationNoteUpdateSchema = createUpdateSchema(moderationNote).omit({ id: true, createdAt: true });

export const auditActionEnum = pgEnum('audit_action', [
  'created',
  'status_changed',
  'assigned',
  'note_added',
  'resolved',
  'dismissed',
  'evidence_reviewed',
]);

export const auditLog = app.table('audit_log', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  reportId: uuid('report_id')
    .notNull()
    .references(() => report.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  moderatorId: uuid('moderator_id')
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  action: auditActionEnum('action').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const AuditLogSelectSchema = createSelectSchema(auditLog);
export const AuditLogInsertSchema = createInsertSchema(auditLog).omit({ id: true, createdAt: true });
export const AuditLogUpdateSchema = createUpdateSchema(auditLog).omit({ id: true, createdAt: true });
