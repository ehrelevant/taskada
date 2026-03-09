
import * as v from 'valibot';
import {
  pgEnum,
  pgSchema,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';


import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';

import { serviceType } from "./service"
import { seeker } from "./seeker"
import { address } from "./address"
import { service } from "./service"

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
export const RequestInsertSchema = v.omit(createInsertSchema(request), ['id', 'createdAt', 'updatedAt']);
export const RequestUpdateSchema = v.omit(createUpdateSchema(request), ['id', 'createdAt', 'updatedAt']);

export const requestImage = app.table('request_image', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  requestId: uuid('request_id')
    .notNull()
    .references(() => request.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  image: text('image').notNull(),
});
export const RequestImageSelectSchema = createSelectSchema(requestImage);
export const RequestImageInsertSchema = v.omit(createInsertSchema(requestImage), ['id']);
export const RequestImageUpdateSchema = v.omit(createUpdateSchema(requestImage), ['id']);