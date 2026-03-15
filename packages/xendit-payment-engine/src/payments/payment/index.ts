import defaultClient from '@src/client';
import { handle_error } from '@src/standard';

import type {
  CancelPaymentRequest,
  CancelPaymentResponse,
  CapturePaymentRequest,
  CapturePaymentResponse,
  GetPaymentStatusRequest,
  GetPaymentStatusResponse,
} from './types';
import {
  CancelPaymentRequestSchema,
  CancelPaymentResponseSchema,
  CapturePaymentRequestSchema,
  CapturePaymentResponseSchema,
  GetPaymentStatusRequestSchema,
  GetPaymentStatusResponseSchema,
} from './schema';

const client = defaultClient.create({
  headers: {
    'api-version': '2024-11-11',
  },
});

export async function capture_payment(request: CapturePaymentRequest): Promise<CapturePaymentResponse> {
  const validated_request = CapturePaymentRequestSchema.parse(request);

  const { capture_amount } = validated_request as { capture_amount: number; payment_id: string };
  const response = await client.post(`v3/payments/${validated_request.payment_id}/capture`, {
    body: JSON.stringify({ capture_amount }),
  });

  await handle_error(response);

  return CapturePaymentResponseSchema.parse(await response.json());
}

export async function cancel_payment(request: CancelPaymentRequest): Promise<CancelPaymentResponse> {
  const validated_request = CancelPaymentRequestSchema.parse(request);
  const response = await client.post(`v3/payments/${validated_request.payment_id}/cancel`);

  await handle_error(response);

  return CancelPaymentResponseSchema.parse(await response.json());
}

export async function get_payment_status(request: GetPaymentStatusRequest): Promise<GetPaymentStatusResponse> {
  const validated_request = GetPaymentStatusRequestSchema.parse(request);

  const response = await client.get(`v3/payments/${validated_request.payment_id}`);

  await handle_error(response);

  return GetPaymentStatusResponseSchema.parse(await response.json());
}
