import * as v from 'valibot';

import { CreateRefundRequestSchema, CreateRefundResponseSchema } from './schema';

export type CreateRefundRequest = v.InferInput<typeof CreateRefundRequestSchema>;
export type CreateRefundResponse = v.InferInput<typeof CreateRefundResponseSchema>;
