import client from '@src/client';
import { handle_error } from '@src/standard';

import type { CreateRefundRequest, CreateRefundResponse } from './types';
import { CreateRefundRequestSchema, CreateRefundResponseSchema } from './schema';

export async function refund_payment(request: CreateRefundRequest): Promise<CreateRefundResponse> {
  const validated_request = CreateRefundRequestSchema.parse(request);
  const response = await client.post('refunds', { body: JSON.stringify(validated_request) });

  await handle_error(response);

  return CreateRefundResponseSchema.parse(await response.json());
}

export * from './types';
