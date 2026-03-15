// Mock environment variables
process.env.XENDIT_API_URL = 'https://api.example.com';
process.env.XENDIT_CLIENT_SECRET = 'mock_secret';

import { mockGet, mockPost, partial_mockKyResponse } from '@src/tests';

import { SessionResponseSchema } from './schema/response';

const { create_session, get_session_status, cancel_session } = await import('.');

const CUST_ID = 'a'.repeat(41);

describe('payment session', () => {
  const sessionResp = {
    payment_session_id: 'ps-661f87c614802d6c402cd82d',
    created: '2026-03-01T00:00:00.000Z',
    updated: '2026-03-01T00:00:00.000Z',
    reference_id: 'ref-1',
    customer_id: CUST_ID,
    session_type: 'PAY',
    allow_save_payment_method: 'OPTIONAL',
    currency: 'USD',
    amount: 100,
    country: 'ID',
    mode: 'PAYMENT_LINK',
    capture_method: 'AUTOMATIC',
    channel_properties: {},
    allowed_payment_channels: [],
    expires_at: '2026-03-01T00:30:00.000Z',
    locale: 'en',
    metadata: {},
    items: null,
    success_return_url: 'https://example.com/success',
    cancel_return_url: 'https://example.com/cancel',
    status: 'ACTIVE',
    payment_link_url: null,
    payment_token_id: null,
    payment_id: null,
    payment_request_id: null,
    business_id: null,
  };

  it('create_session - success', async () => {
    const req = {
      reference_id: 'ref-123123124134',
      customer_id: CUST_ID,
      customer: {
        type: 'INDIVIDUAL' as const,
        reference_id: 'ref-c',
        individual_detail: { given_names: 'First', surname: 'Last' },
      },
      session_type: 'SAVE' as const,
      currency: 'PHP' as const,
      amount: 0,
      mode: 'PAYMENT_LINK' as const,
      country: 'PH' as const,
      metadata: null,
      items: null,
    };

    mockPost.mockResolvedValueOnce(partial_mockKyResponse({ status: 201, json: async () => sessionResp }));
    const res = await create_session(req);
    expect(res).toEqual(SessionResponseSchema.parse(sessionResp));
  });

  it('create_session - SAVE with non-zero amount should fail validation', async () => {
    const badReq = {
      reference_id: 'ref-123',
      customer_id: CUST_ID,
      customer: { type: 'INDIVIDUAL' as const, reference_id: 'ref-c', individual_detail: { given_names: 'First', surname: 'Last' } },
      session_type: 'SAVE' as const,
      currency: 'PHP' as const,
      amount: 100,
      mode: 'PAYMENT_LINK' as const,
      country: 'PH' as const,
      metadata: null,
      items: null,
    };

    await expect(create_session(badReq)).rejects.toThrow('For SAVE session_type, the amount must be 0.');
  });

  it('create_session - API error', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 400,
        json: async () => ({ error_code: 'INVALID_REQUEST', message: 'Bad request', errors: [] }),
      }),
    );

    await expect(
      create_session({
        reference_id: 'ref-1',
        customer_id: CUST_ID,
        customer: { type: 'INDIVIDUAL', reference_id: 'ref-c', individual_detail: {given_names: "Alice", surname:"Doe"} },
        session_type: 'PAY',
        currency: 'USD',
        amount: 100,
        mode: 'PAYMENT_LINK',
        country: 'ID',
        channel_properties: {},
        metadata: null,
        items: null,
      }),
    ).rejects.toThrow('An error occurred while processing the session due to INVALID_REQUEST');
  });

  it('get_session_status - success', async () => {
    mockGet.mockResolvedValueOnce(partial_mockKyResponse({ status: 200, json: async () => sessionResp }));
    const res = await get_session_status({ session_id: 'ps-661f87c614802d6c402cd82d' });
    expect(res).toEqual(SessionResponseSchema.parse(sessionResp));
  });

  it('get_session_status - API error', async () => {
    mockGet.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 404,
        json: async () => ({ error_code: 'NOT_FOUND', message: 'Not found', errors: [] }),
      }),
    );
    await expect(get_session_status({ session_id: 'ps-661f87c614802d6c402cd82d' })).rejects.toThrow(
      'An error occurred while processing the session due to NOT_FOUND',
    );
  });

  it('cancel_session - success', async () => {
    mockPost.mockResolvedValueOnce(partial_mockKyResponse({ status: 200, json: async () => sessionResp }));
    const res = await cancel_session({ session_id: 'ps-661f87c614802d6c402cd82d' });
    expect(res).toEqual(SessionResponseSchema.parse(sessionResp));
  });

  it('cancel_session - API error', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 403,
        json: async () => ({ error_code: 'FORBIDDEN', message: 'Forbidden', errors: [] }),
      }),
    );
    await expect(cancel_session({ session_id: 'ps-661f87c614802d6c402cd82d' })).rejects.toThrow(
      'An error occurred while processing the session due to FORBIDDEN',
    );
  });
});
