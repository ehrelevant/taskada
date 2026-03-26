import defaultClient from '@src/client';

import type { GetPaymentTokenStatusRequest, GetPaymentTokenStatusResponse } from './types';
import { GetPaymentTokenStatusRequestSchema, GetPaymentTokenStatusResponseSchema } from './schema';

const client = defaultClient.extend({
  headers: {
    'api-version': '2024-11-11',
  },
});

export async function get_payment_token_status(
  request: GetPaymentTokenStatusRequest,
): Promise<GetPaymentTokenStatusResponse> {
  const validated_request = GetPaymentTokenStatusRequestSchema.parse(request);

  const response = await client.get(`v3/payment_tokens/${validated_request.payment_token_id}`);

  return GetPaymentTokenStatusResponseSchema.parse(await response.json());
}
