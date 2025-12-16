import * as v from 'valibot';
import { boolean, check, integer, jsonb, numeric, pgEnum, pgSchema, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import { sql } from 'drizzle-orm';

import { geographyPointColumnType } from './custom/geography';

export const app = pgSchema('app');

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
export const UserInsertSchema = v.omit(
  createInsertSchema(user, {
    email: v.pipe(v.string(), v.email()),
  }),
  ['id', 'createdAt', 'updatedAt'],
);
export const UserUpdateSchema = v.omit(
  createUpdateSchema(user, {
    email: v.optional(v.pipe(v.string(), v.email())),
  }),
  ['id', 'createdAt', 'updatedAt']
);

export const roleEnum = pgEnum('role', ['provider', 'seeker', 'admin']);
export type Role = typeof roleEnum.enumValues[number];

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
export const UserRoleInsertSchema = v.omit(createInsertSchema(userRole), ['assigned_at']);
export const UserRoleUpdateSchema = v.omit(createUpdateSchema(userRole), ['assigned_at']);

export const agency = app.table('agency', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  avatarUrl: text('avatar_url'),
});
export type Agency = typeof agency.$inferSelect;
export type NewAgency = typeof agency.$inferInsert;
export const AgencySelectSchema = createSelectSchema(agency);
export const AgencyInsertSchema = v.omit(createInsertSchema(agency), ['id']);
export const AgencyUpdateSchema = v.omit(createUpdateSchema(agency), ['id']);

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
  name: text('name').notNull(),
  description: text('description'),
  iconUrl: text('icon_url'),
});
export type ServiceType = typeof serviceType.$inferSelect;
export type NewServiceType = typeof serviceType.$inferInsert;
export const ServiceTypeSelectSchema = createSelectSchema(serviceType);
export const ServiceTypeInsertSchema = v.omit(createInsertSchema(serviceType), ['id']);
export const ServiceTypeUpdateSchema = v.omit(createUpdateSchema(serviceType), ['id']);

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
export const ServiceInsertSchema = v.omit(createInsertSchema(service), ['id']);
export const ServiceUpdateSchema = v.omit(createUpdateSchema(service), ['id']);

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
export const PortfolioInsertSchema = v.omit(createInsertSchema(portfolio), ['id']);
export const PortfolioUpdateSchema = v.omit(createUpdateSchema(portfolio), ['id']);

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
export const PortfolioImageInsertSchema = v.omit(createInsertSchema(portfolioImage), ['id']);
export const PortfolioImageUpdateSchema = v.omit(createUpdateSchema(portfolioImage), ['id']);

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
export const ReviewInsertSchema = v.omit(createInsertSchema(review), ['id', 'createdAt', 'updatedAt']);
export const ReviewUpdateSchema = v.omit(createUpdateSchema(review), ['id', 'createdAt', 'updatedAt']);

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
export const ReviewImageInsertSchema = v.omit(createInsertSchema(reviewImage), ['id']);
export const ReviewImageUpdateSchema = v.omit(createUpdateSchema(reviewImage), ['id']);

export const request = app.table('request', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  serviceTypeId: uuid('service_type_id')
    .notNull()
    .references(() => serviceType.id, { onUpdate: 'cascade', onDelete: 'restrict' }),
  seekerUserId: uuid('seeker_id')
    .notNull()
    .references(() => seeker.userId, { onUpdate: 'cascade', onDelete: 'cascade' }),
  addressId: uuid('address_id')
    .notNull()
    .references(() => address.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type Request = typeof request.$inferSelect;
export type NewRequest = typeof request.$inferInsert;
export const RequestSelectSchema = createSelectSchema(request);
export const RequestInsertSchema = v.omit(createInsertSchema(request), ['id', 'createdAt', 'updatedAt']);
export const RequestUpdateSchema = v.omit(createUpdateSchema(request), ['id', 'createdAt', 'updatedAt']);

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
export const RequestImageInsertSchema = v.omit(createInsertSchema(requestImage), ['id']);
export const RequestImageUpdateSchema = v.omit(createUpdateSchema(requestImage), ['id']);

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'accepted',
  'in_transit',
  'serving',
  'completed',
  'cancelled',
]);
export type BookingStatus = typeof bookingStatusEnum.enumValues[number];

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
  requestId: uuid('request_id')
    .notNull()
    .references(() => request.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  status: bookingStatusEnum('status').notNull().default('pending'), // <--- ADDED
  cost: numeric('cost', { mode: 'number', precision: 10, scale: 2 }).notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
export type Booking = typeof booking.$inferSelect;
export type NewBooking = typeof booking.$inferInsert;
export const BookingSelectSchema = createSelectSchema(booking);
export const BookingInsertSchema = v.omit(createInsertSchema(booking), ['id', 'createdAt', 'updatedAt']);
export const BookingUpdateSchema = v.omit(createUpdateSchema(booking), ['id', 'createdAt', 'updatedAt']);

export const address = app.table('address', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  label: text('label'), // If no label, use address as determined by reverse geocoding
  coordinates: geographyPointColumnType().notNull(),
});
export type Address = typeof address.$inferSelect;
export type NewAddress = typeof address.$inferInsert;
export const AddressSelectSchema = createSelectSchema(address);
export const AddressInsertSchema = v.omit(createInsertSchema(address), ['id']);
export const AddressUpdateSchema = v.omit(createUpdateSchema(address), ['id']);

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
export const MessageInsertSchema = v.omit(createInsertSchema(message), ['id', 'createdAt', 'updatedAt']);
export const MessageUpdateSchema = v.omit(createUpdateSchema(message), ['id', 'createdAt', 'updatedAt']);

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
export const MessageImageInsertSchema = v.omit(createInsertSchema(messageImage), ['id']);
export const MessageImageUpdateSchema = v.omit(createUpdateSchema(messageImage), ['id']);

export const paymentMethod = app.table('payment_method', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  type: text('type').notNull(),
  channelCode: text('channel_code').notNull(),
  externalId: text('external_id').notNull(),
  status: text('status').default('PENDING').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
export type PaymentMethod = typeof paymentMethod.$inferSelect;
export type NewPaymentMethod = typeof paymentMethod.$inferInsert;
export const PaymentMethodSelectSchema = createSelectSchema(paymentMethod);
export const PaymentMethodInsertSchema = v.omit(createInsertSchema(paymentMethod), ['id']);
export const PaymentMethodUpdateSchema = v.omit(createUpdateSchema(paymentMethod), ['id']);