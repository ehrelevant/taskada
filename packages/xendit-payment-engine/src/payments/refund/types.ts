import * as z from 'zod';

import { CreateRefundRequestSchema, CreateRefundResponseSchema } from './schema';

export type CreateRefundRequest = z.input<typeof CreateRefundRequestSchema>;
export type CreateRefundResponse = z.infer<typeof CreateRefundResponseSchema>;
