import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { pgEnum, pgSchema, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { address } from './address';
import { seeker } from './seeker';
import { service } from './service';
import { serviceType } from './service';

const app = pgSchema('app');

export const requestStatusEnum = pgEnum('request_status', ['pending', 'settling']);

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
export const RequestImageSelectSchema = createSelectSchema(requestImage);
export const RequestImageInsertSchema = createInsertSchema(requestImage).omit({ id: true });
export const RequestImageUpdateSchema = createUpdateSchema(requestImage).omit({ id: true });
