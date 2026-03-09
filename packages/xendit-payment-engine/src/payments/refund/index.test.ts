// Mock environment variables
process.env.API_URL = 'https://api.example.com';
process.env.XENDIT_CLIENT_SECRET = 'mock_secret';

import * as v from 'valibot';
import { mockPost, partial_mockKyResponse } from '@src/tests';

import { CreateRefundResponseSchema } from './schema';

const { refund_payment } = await import('.');

const payment_request_sample = {
  reference_id: '90392f42-d98a-49ef-a7f3-abcezas123',
  payment_request_id: 'pr-90392f42-d98a-49ef-a7f3-abcezas123',
  currency: 'IDR',
  amount: 10000,
  reason: 'REQUESTED_BY_CUSTOMER',
};

describe('refund_payment', () => {
  const refundResponse = {
    id: 'rfd-69e77490-d2cc-4bf3-8319-e064e121db93',
    payment_request_id: payment_request_sample.payment_request_id,
    payment_id: 'py-1402feb0-bb79-47ae-9d1e-e69394d3949c',
    invoice_id: '65fc7522ff846905c2fc1c8d',
    payment_method_type: 'CARD',
    reference_id: payment_request_sample.reference_id,
    channel_code: 'CHANNEL_CODE',
    currency: payment_request_sample.currency,
    amount: payment_request_sample.amount,
    status: 'SUCCEEDED',
    reason: payment_request_sample.reason,
    refund_fee_amount: 0,
    metadata: {},
    created: '2026-03-01T00:00:00.000Z',
    updated: '2026-03-01T00:00:00.000Z',
  };

  it('refund_payment - success', async () => {
    mockPost.mockResolvedValueOnce(partial_mockKyResponse({ status: 201, json: async () => refundResponse }));
    const res = await refund_payment(payment_request_sample);
    expect(res).toEqual(v.parse(CreateRefundResponseSchema, refundResponse));
  });

  it('refund_payment - API error', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 400,
        json: async () => ({ error_code: 'INVALID_REQUEST', message: 'Bad request', errors: [] }),
      }),
    );
    await expect(refund_payment(payment_request_sample)).rejects.toThrow(
      'An error occurred while processing the session due to INVALID_REQUEST',
    );
  });
});
