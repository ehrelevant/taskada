import * as v from 'valibot';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-valibot';
import { pgSchema, text, uuid } from 'drizzle-orm/pg-core';

import { geographyPointColumnType } from './geography';

const app = pgSchema('app');

export const address = app.table('address', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  label: text('label'), // If no label, use address as determined by reverse geocoding
  coordinates: geographyPointColumnType().notNull(),
});
export const AddressSelectSchema = createSelectSchema(address);
export const AddressInsertSchema = v.omit(createInsertSchema(address), ['id']);
export const AddressUpdateSchema = v.omit(createUpdateSchema(address), ['id']);
