export * from './address';
export * from './agency';
export * from './auth';
export * from './booking';
export * from './geography';
export * from './interest';
export * from './message';
export * from './payments';
export * from './portfolio';
export * from './provider';
export * from './request';
export * from './review';
export * from './role';
export * from './seeker';
export * from './service';
export * from './token';
export * from './role';
export * from './user';
export * from './report';

// TODO: Add relation.ts

import { pgSchema } from 'drizzle-orm/pg-core';

export const app = pgSchema('app');
