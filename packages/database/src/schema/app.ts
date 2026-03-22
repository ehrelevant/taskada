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

import { geographyPointColumnType } from './custom/geography';

export const app = pgSchema('app');

export const banStatusEnum = pgEnum('ban_status', ['active', 'suspended', 'banned']);
export type BanStatus = (typeof banStatusEnum.enumValues)[number];

export const user = app.table(
  'user',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    email: text('email').unique().notNull(),
    firstName: text('first_name').notNull().default(''),
    middleName: text('middle_name').notNull().default(''),
    lastName: text('last_name').notNull().default(''),
    phoneNumber: text('phone_number').unique().notNull(),
    avatarUrl: text('avatar_url'),
    emailVerified: boolean('email_verified').notNull().default(false),
    xenditCustomerId: text('xendit_customer_id').unique(),
    banStatus: banStatusEnum('ban_status').notNull().default('active'),
    warningsCount: integer('warnings_count').notNull().default(0),
    suspendedUntil: timestamp('suspended_until', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  ({ email, phoneNumber }) => [
    check('user_email_non_empty', sql`${email} <> ''`),
    check('user_phone_number_non_empty', sql`${phoneNumber} <> ''`),
  ],
);
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export const UserSelectSchema = createSelectSchema(user);
export const UserInsertSchema = createInsertSchema(user, {
  email: schema => schema.email(),
}).omit({ id: true, createdAt: true, updatedAt: true });
export const UserUpdateSchema = createUpdateSchema(user, {
  email: schema => schema.email(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const roleEnum = pgEnum('role', ['provider', 'seeker', 'admin']);
export type Role = (typeof roleEnum.enumValues)[number];

export const userRole = app.table(
  'user_role',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    role: roleEnum().notNull(),
    assigned_at: timestamp('assigned_at', { withTimezone: true }).defaultNow(),
  },
  ({ userId, role }) => [primaryKey({ columns: [userId, role] })],
);
export type UserRole = typeof userRole.$inferSelect;
export type NewUserRole = typeof userRole.$inferInsert;
export const UserRoleSelectSchema = createSelectSchema(userRole);
export const UserRoleInsertSchema = createInsertSchema(userRole).omit({ assigned_at: true });
export const UserRoleUpdateSchema = createUpdateSchema(userRole).omit({ assigned_at: true });

export const agency = app.table('agency', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  avatarUrl: text('avatar_url'),
});
export type Agency = typeof agency.$inferSelect;
export type NewAgency = typeof agency.$inferInsert;
export const AgencySelectSchema = createSelectSchema(agency);
export const AgencyInsertSchema = createInsertSchema(agency).omit({ id: true });
export const AgencyUpdateSchema = createUpdateSchema(agency).omit({ id: true });

export const provider = app.table('provider', {
  userId: uuid('user_id')
    .primaryKey()
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  agencyId: uuid('agency_id').references(() => agency.id, { onUpdate: 'cascade', onDelete: 'set null' }),
  isAccepting: boolean('is_accepting').notNull().default(false),
});
export type Provider = typeof provider.$inferSelect;
export type NewProvider = typeof provider.$inferInsert;
export const ProviderSelectSchema = createSelectSchema(provider);
export const ProviderInsertSchema = createInsertSchema(provider);
export const ProviderUpdateSchema = createUpdateSchema(provider);

export const seeker = app.table('seeker', {
  userId: uuid('user_id')
    .primaryKey()
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
});
export type Seeker = typeof seeker.$inferSelect;
export type NewSeeker = typeof seeker.$inferInsert;
export const SeekerSelectSchema = createSelectSchema(seeker);
export const SeekerInsertSchema = createInsertSchema(seeker);
export const SeekerUpdateSchema = createUpdateSchema(seeker);

export const serviceType = app.table('service_type', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description'),
  iconUrl: text('icon_url'),
});
export type ServiceType = typeof serviceType.$inferSelect;
export type NewServiceType = typeof serviceType.$inferInsert;
export const ServiceTypeSelectSchema = createSelectSchema(serviceType);
export const ServiceTypeInsertSchema = createInsertSchema(serviceType).omit({ id: true });
export const ServiceTypeUpdateSchema = createUpdateSchema(serviceType).omit({ id: true });

export const service = app.table('service', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  serviceTypeId: uuid('service_type_id')
    .notNull()
    .references(() => serviceType.id, { onUpdate: 'cascade', onDelete: 'restrict' }),
  providerUserId: uuid('provider_id')
    .notNull()
    .references(() => provider.userId, { onUpdate: 'cascade', onDelete: 'cascade' }),
  initialCost: numeric('initial_cost', { mode: 'number', precision: 10, scale: 2 }).notNull().default(0),
  isEnabled: boolean('is_enabled').notNull().default(false),
});
export type Service = typeof service.$inferSelect;
export type NewService = typeof service.$inferInsert;
export const ServiceSelectSchema = createSelectSchema(service);
export const ServiceInsertSchema = createInsertSchema(service).omit({ id: true });
export const ServiceUpdateSchema = createUpdateSchema(service).omit({ id: true });

export const portfolio = app.table('portfolio', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  serviceId: uuid('service_id')
    .notNull()
    .references(() => service.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  description: text('description'),
});
export type Portfolio = typeof portfolio.$inferSelect;
export type NewPortfolio = typeof portfolio.$inferInsert;
export const PortfolioSelectSchema = createSelectSchema(portfolio);
export const PortfolioInsertSchema = createInsertSchema(portfolio).omit({ id: true });
export const PortfolioUpdateSchema = createUpdateSchema(portfolio).omit({ id: true });

export const portfolioImage = app.table('portfolio_image', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  portfolioId: uuid('portfolio_id')
    .notNull()
    .references(() => portfolio.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  image: text('image').notNull(),
});
export type PortfolioImage = typeof portfolioImage.$inferSelect;
export type NewPortfolioImage = typeof portfolioImage.$inferInsert;
export const PortfolioImageSelectSchema = createSelectSchema(portfolioImage);
export const PortfolioImageInsertSchema = createInsertSchema(portfolioImage).omit({ id: true });
export const PortfolioImageUpdateSchema = createUpdateSchema(portfolioImage).omit({ id: true });

export const review = app.table(
  'review',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    serviceId: uuid('service_id')
      .notNull()
      .references(() => service.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    reviewerUserId: uuid('reviewer_user_id')
      .notNull()
      .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    rating: integer('rating'),
    comment: text('comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  ({ rating }) => [check('review_rating_range', sql`${rating} IS NULL OR ${rating} BETWEEN 1 AND 5`)],
);
export type Review = typeof review.$inferSelect;
export type NewReview = typeof review.$inferInsert;
export const ReviewSelectSchema = createSelectSchema(review);
export const ReviewInsertSchema = createInsertSchema(review).omit({ id: true, createdAt: true, updatedAt: true });
export const ReviewUpdateSchema = createUpdateSchema(review).omit({ id: true, createdAt: true, updatedAt: true });

export const reviewImage = app.table('review_image', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  reviewId: uuid('review_id')
    .notNull()
    .references(() => review.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  image: text('image').notNull(),
});
export type ReviewImage = typeof reviewImage.$inferSelect;
export type NewReviewImage = typeof reviewImage.$inferInsert;
export const ReviewImageSelectSchema = createSelectSchema(reviewImage);
export const ReviewImageInsertSchema = createInsertSchema(reviewImage).omit({ id: true });
export const ReviewImageUpdateSchema = createUpdateSchema(reviewImage).omit({ id: true });

export const requestStatusEnum = pgEnum('request_status', ['pending', 'settling']);
export type RequestStatus = (typeof requestStatusEnum.enumValues)[number];

export const request = app.table('request', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  serviceTypeId: uuid('service_type_id')
    .notNull()
    .references(() => serviceType.id, { onUpdate: 'cascade', onDelete: 'restrict' }),
  serviceId: uuid('service_id').references(() => service.id, { onUpdate: 'cascade', onDelete: 'set null' }),
  seekerUserId: uuid('seeker_id')
    .notNull()
    .references(() => seeker.userId, { onUpdate: 'cascade', onDelete: 'cascade' }),
  addressId: uuid('address_id')
    .notNull()
    .references(() => address.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  description: text('description'),
  status: requestStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type Request = typeof request.$inferSelect;
export type NewRequest = typeof request.$inferInsert;
export const RequestSelectSchema = createSelectSchema(request);
export const RequestInsertSchema = createInsertSchema(request).omit({ id: true, createdAt: true, updatedAt: true });
export const RequestUpdateSchema = createUpdateSchema(request).omit({ id: true, createdAt: true, updatedAt: true });

export const requestImage = app.table('request_image', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  requestId: uuid('request_id')
    .notNull()
    .references(() => request.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  image: text('image').notNull(),
});
export type RequestImage = typeof requestImage.$inferSelect;
export type NewRequestImage = typeof requestImage.$inferInsert;
export const RequestImageSelectSchema = createSelectSchema(requestImage);
export const RequestImageInsertSchema = createInsertSchema(requestImage).omit({ id: true });
export const RequestImageUpdateSchema = createUpdateSchema(requestImage).omit({ id: true });

export const bookingStatusEnum = pgEnum('booking_status', ['in_transit', 'serving', 'completed', 'cancelled']);
export type BookingStatus = (typeof bookingStatusEnum.enumValues)[number];

export const booking = app.table('booking', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  providerUserId: uuid('provider_id')
    .notNull()
    .references(() => provider.userId, { onUpdate: 'cascade', onDelete: 'cascade' }),
  serviceId: uuid('service_id')
    .notNull()
    .references(() => service.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  seekerUserId: uuid('seeker_id')
    .notNull()
    .references(() => seeker.userId, { onUpdate: 'cascade', onDelete: 'cascade' }),
  status: bookingStatusEnum('status').notNull().default('in_transit'),
  cost: numeric('cost', { mode: 'number', precision: 10, scale: 2 }).notNull().default(0),
  specifications: text('specifications'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type Booking = typeof booking.$inferSelect;
export type NewBooking = typeof booking.$inferInsert;
export const BookingSelectSchema = createSelectSchema(booking);
export const BookingInsertSchema = createInsertSchema(booking).omit({ id: true, createdAt: true, updatedAt: true });
export const BookingUpdateSchema = createUpdateSchema(booking).omit({ id: true, createdAt: true, updatedAt: true });

export const interestStatusEnum = pgEnum('interest_status', ['pending', 'accepted', 'rejected']);
export type InterestStatus = (typeof interestStatusEnum.enumValues)[number];

export const providerInterest = app.table('provider_interest', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  requestId: uuid('request_id')
    .notNull()
    .references(() => request.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  providerUserId: uuid('provider_id')
    .notNull()
    .references(() => provider.userId, { onUpdate: 'cascade', onDelete: 'cascade' }),
  serviceId: uuid('service_id')
    .notNull()
    .references(() => service.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  status: interestStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type ProviderInterest = typeof providerInterest.$inferSelect;
export type NewProviderInterest = typeof providerInterest.$inferInsert;
export const ProviderInterestSelectSchema = createSelectSchema(providerInterest);
export const ProviderInterestInsertSchema = createInsertSchema(providerInterest).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const ProviderInterestUpdateSchema = createUpdateSchema(providerInterest).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const address = app.table('address', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  label: text('label'), // If no label, use address as determined by reverse geocoding
  coordinates: geographyPointColumnType().notNull(),
});
export type Address = typeof address.$inferSelect;
export type NewAddress = typeof address.$inferInsert;
export const AddressSelectSchema = createSelectSchema(address);
export const AddressInsertSchema = createInsertSchema(address).omit({ id: true });
export const AddressUpdateSchema = createUpdateSchema(address).omit({ id: true });

export const message = app.table('message', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  bookingId: uuid('booking_id')
    .notNull()
    .references(() => booking.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  message: text('message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type Message = typeof message.$inferSelect;
export type NewMessage = typeof message.$inferInsert;
export const MessageSelectSchema = createSelectSchema(message);
export const MessageInsertSchema = createInsertSchema(message).omit({ id: true, createdAt: true, updatedAt: true });
export const MessageUpdateSchema = createUpdateSchema(message).omit({ id: true, createdAt: true, updatedAt: true });

export const messageImage = app.table('message_image', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  messageId: uuid('message_id')
    .notNull()
    .references(() => message.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  image: text('image').notNull(),
});
export type MessageImage = typeof messageImage.$inferSelect;
export type NewMessageImage = typeof messageImage.$inferInsert;
export const MessageImageSelectSchema = createSelectSchema(messageImage);
export const MessageImageInsertSchema = createInsertSchema(messageImage).omit({ id: true });
export const MessageImageUpdateSchema = createUpdateSchema(messageImage).omit({ id: true });

export const paymentMethod = app.table('payment_method', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  type: text('type').notNull(),
  channelCode: text('channel_code').notNull(),
  externalId: text('external_id').notNull(),
  status: text('status').default('PENDING').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
export type PaymentMethod = typeof paymentMethod.$inferSelect;
export type NewPaymentMethod = typeof paymentMethod.$inferInsert;
export const PaymentMethodSelectSchema = createSelectSchema(paymentMethod);
export const PaymentMethodInsertSchema = createInsertSchema(paymentMethod).omit({ id: true });
export const PaymentMethodUpdateSchema = createUpdateSchema(paymentMethod).omit({ id: true });

export const pushToken = app.table('push_token', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  token: text('token').notNull(),
  platform: text('platform').notNull(), // 'ios' or 'android'
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type PushToken = typeof pushToken.$inferSelect;
export type NewPushToken = typeof pushToken.$inferInsert;
export const PushTokenSelectSchema = createSelectSchema(pushToken);
export const PushTokenInsertSchema = createInsertSchema(pushToken).omit({ id: true, createdAt: true, updatedAt: true });
export const PushTokenUpdateSchema = createUpdateSchema(pushToken).omit({ id: true, createdAt: true, updatedAt: true });

export const reportStatusEnum = pgEnum('report_status', ['open', 'under_review', 'resolved', 'dismissed']);
export type ReportStatus = (typeof reportStatusEnum.enumValues)[number];

export const reportReasonEnum = pgEnum('report_reason', [
  'harassment',
  'fraudulent_payment',
  'unfair_cancellation',
  'no_show',
  'inappropriate_behavior',
  'poor_service',
  'other',
]);
export type ReportReason = (typeof reportReasonEnum.enumValues)[number];

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
export type Report = typeof report.$inferSelect;
export type NewReport = typeof report.$inferInsert;
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
export type ReportImage = typeof reportImage.$inferSelect;
export type NewReportImage = typeof reportImage.$inferInsert;
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
export type ModerationNote = typeof moderationNote.$inferSelect;
export type NewModerationNote = typeof moderationNote.$inferInsert;
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
export type AuditAction = (typeof auditActionEnum.enumValues)[number];

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
export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;
export const AuditLogSelectSchema = createSelectSchema(auditLog);
export const AuditLogInsertSchema = createInsertSchema(auditLog).omit({ id: true, createdAt: true });
export const AuditLogUpdateSchema = createUpdateSchema(auditLog).omit({ id: true, createdAt: true });
