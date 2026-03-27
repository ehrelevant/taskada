import * as v from 'valibot';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { pgSchema, text, uuid } from 'drizzle-orm/pg-core';

import { service } from './service';

const app = pgSchema('app');

export const portfolio = app.table('portfolio', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  serviceId: uuid('service_id')
    .notNull()
    .references(() => service.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
  description: text('description'),
});
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
export const PortfolioImageSelectSchema = createSelectSchema(portfolioImage);
export const PortfolioImageInsertSchema = createInsertSchema(portfolioImage).omit({ id: true });
export const PortfolioImageUpdateSchema = createUpdateSchema(portfolioImage).omit({ id: true });
