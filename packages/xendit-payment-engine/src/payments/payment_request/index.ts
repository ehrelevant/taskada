import defaultClient from '@src/client';
import { handle_error } from '@src/standard';

import type {
  CancelPaymentRequestRequest,
  CancelPaymentRequestResponse,
  GetPaymentRequestStatusRequest,
  GetPaymentRequestStatusResponse,
  SimulatePaymentRequest,
  SimulatePaymentResponse,
} from './types';
import {
  CancelPaymentRequestRequestSchema,
  CancelPaymentRequestResponseSchema,
  GetPaymentRequestStatusRequestSchema,
  GetPaymentRequestStatusResponseSchema,
  SimulatePaymentRequestSchema,
  SimulatePaymentResponseSchema,
} from './schema';

const client = defaultClient.extend({
  headers: {
    'api-version': '2024-11-11',
  },
});

export async function get_payment_request_status(
  request: GetPaymentRequestStatusRequest,
): Promise<GetPaymentRequestStatusResponse> {
  const validated_request = GetPaymentRequestStatusRequestSchema.parse(request);

  const response = await client.get(`v3/payment_requests/${validated_request.payment_request_id}`);

  await handle_error(response);

  return GetPaymentRequestStatusResponseSchema.parse(await response.json());
}

export async function cancel_payment_request(
  request: CancelPaymentRequestRequest,
): Promise<CancelPaymentRequestResponse> {
  const validated_request = CancelPaymentRequestRequestSchema.parse(request);

  const response = await client.post(`v3/payment_requests/${validated_request.payment_request_id}/cancel`);

  await handle_error(response);

  return CancelPaymentRequestResponseSchema.parse(await response.json());
}

export async function simulate_payment(request: SimulatePaymentRequest): Promise<SimulatePaymentResponse> {
  const validated_request = SimulatePaymentRequestSchema.parse(request);

  const response = await client.post(`v3/payment_requests/${validated_request.payment_request_id}/simulate`, {
    body: JSON.stringify({ amount: validated_request.amount }),
  });

  await handle_error(response);

  return SimulatePaymentResponseSchema.parse(await response.json());
}
