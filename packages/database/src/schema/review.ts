import * as v from 'valibot';
import {
  check,
  integer,
  pgSchema,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import { sql } from 'drizzle-orm';

import { service } from "./service"
import { user } from "./user"

const app = pgSchema('app');

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
export const ReviewImageSelectSchema = createSelectSchema(reviewImage);
export const ReviewImageInsertSchema = v.omit(createInsertSchema(reviewImage), ['id']);
export const ReviewImageUpdateSchema = v.omit(createUpdateSchema(reviewImage), ['id']);