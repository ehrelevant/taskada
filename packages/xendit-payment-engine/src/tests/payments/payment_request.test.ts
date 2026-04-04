// Ensure env vars required by src/client.ts exist before modules are imported
process.env.XENDIT_API_URL = 'http://test.local';
process.env.XENDIT_CLIENT_SECRET = 'test_secret';

import { jest } from '@jest/globals';
import { mock_ky_client, mockGet, mockPost, partial_mockKyResponse } from '@src/tests/utils';

import type {
  cancel_payment_request as cancel_payment_request_fn,
  get_payment_request_status as get_payment_request_status_fn,
  simulate_payment as simulate_payment_fn,
} from '../../payments/payment_request/index';

let get_payment_request_status: typeof get_payment_request_status_fn;
let cancel_payment_request: typeof cancel_payment_request_fn;
let simulate_payment: typeof simulate_payment_fn;

jest.unstable_mockModule('@src/client', mock_ky_client);

beforeAll(async () => {
  const mod = await import('../../payments/payment_request/index');
  get_payment_request_status = mod.get_payment_request_status;
  cancel_payment_request = mod.cancel_payment_request;
  simulate_payment = mod.simulate_payment;
});

describe('payment_request index', () => {
  const validId = 'pr-8877c08a-740d-4153-9816-3d744ed197a5';

  const paymentObject = {
    business_id: 'biz-1',
    reference_id: 'ref-1',
    payment_request_id: validId,
    payment_token_id: 'pt-1',
    customer_id: 'cus-1',
    latest_payment_id: 'py-1',
    type: 'PAY',
    country: 'ID',
    currency: 'IDR',
    request_amount: 10000,
    capture_method: 'AUTOMATIC',
    channel_code: 'CARD',
    channel_properties: {},
    actions: [],
    status: 'SUCCEEDED',
    failure_code: 'FAILURE_DETAILS_UNAVAILABLE',
    description: 'desc',
    metadata: {},
    items: [],
    shipping_information: {},
    created: '2023-01-01T00:00:00Z',
    updated: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
  });

  test('get_payment_request_status - success', async () => {
    mockGet.mockResolvedValue(partial_mockKyResponse({ status: 200, json: async () => paymentObject }));

    const res = await get_payment_request_status({ payment_request_id: validId });

    expect(res).toEqual(paymentObject);
    expect(mockGet).toHaveBeenCalledWith(`v3/payment_requests/${validId}`);
  });

  test('get_payment_request_status - error path', async () => {
    mockGet.mockResolvedValue(
      partial_mockKyResponse({ status: 400, json: async () => ({ error_code: 'ERR_X', message: 'boom', errors: [] }) }),
    );

    await expect(get_payment_request_status({ payment_request_id: validId })).rejects.toThrow('Bad Request');
  });

  test('cancel_payment_request - success', async () => {
    mockPost.mockResolvedValue(partial_mockKyResponse({ status: 200, json: async () => paymentObject }));

    const res = await cancel_payment_request({ payment_request_id: validId });

    expect(res).toEqual(paymentObject);
    expect(mockPost).toHaveBeenCalledWith(`v3/payment_requests/${validId}/cancel`);
  });

  test('cancel_payment_request - error path', async () => {
    mockPost.mockResolvedValue(
      partial_mockKyResponse({
        status: 400,
        json: async () => ({ error_code: 'ERR_CANCEL', message: 'no', errors: [] }),
      }),
    );

    await expect(cancel_payment_request({ payment_request_id: validId })).rejects.toThrow('Bad Request');
  });

  test('simulate_payment - success and body check', async () => {
    const simulateResponse = { status: 'PENDING', message: 'processing' };
    mockPost.mockResolvedValue(partial_mockKyResponse({ status: 200, json: async () => simulateResponse }));

    const res = await simulate_payment({ payment_request_id: validId, amount: 5000 });

    expect(res).toEqual(simulateResponse);
    expect(mockPost).toHaveBeenCalledWith(
      `v3/payment_requests/${validId}/simulate`,
      expect.objectContaining({ body: JSON.stringify({ amount: 5000 }) }),
    );
  });

  test('simulate_payment - error path', async () => {
    mockPost.mockResolvedValue(
      partial_mockKyResponse({
        status: 400,
        json: async () => ({ error_code: 'ERR_SIM', message: 'sim', errors: [] }),
      }),
    );

    await expect(simulate_payment({ payment_request_id: validId, amount: 1000 })).rejects.toThrow('Bad Request');
  });
});
