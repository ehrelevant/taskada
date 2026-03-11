// Mock environment
process.env.XENDIT_API_URL = 'https://api.example.com';
process.env.XENDIT_CLIENT_SECRET = 'mock_secret';

import * as v from 'valibot';
import { mockGet, mockPost, partial_mockKyResponse } from '@src/tests';

import {
  CancelPayoutResponseSchema,
  CreatePayoutResponseSchema,
  GetPaymentChannelsResponseSchema,
  GetPayoutResponseSchema,
  ListPayoutsResponseSchema,
} from './schema';

// jest.unstable_mockModule("@src/client", () => ({
//   default: {
//     create: () => ({ post: mockPost, get: mockGet }),
//   },
// }));

const { create_payout, get_payout, get_payout_by_reference_id, cancel_payout, get_payment_channels } = await import(
  './index'
);

const CreatePayoutRequestExample = {
  reference_id: 'myref-1482928194',
  channel_code: 'ID_BCA',
  channel_properties: {
    account_number: '000000000099',
    account_holder_name: 'Michael Chen',
  },
  amount: 10000,
  description: 'July payout',
  currency: 'IDR' as const,
};

const CreatePayoutResponseExample = {
  id: 'disb-571f3644d2b4edf0745e9703',
  amount: 10000,
  channel_code: 'ID_BCA',
  currency: 'IDR',
  status: 'ACCEPTED',
  description: 'July payout',
  reference_id: 'myref-1482928194',
  created: '2024-12-31T23:53:59Z',
  updated: '2024-12-31T23:53:59Z',
  estimated_arrival_time: '2024-12-31T23:59:59Z',
  business_id: '6018306aa16ad90cb3c43ba7',
  channel_properties: {
    account_number: '000000000099',
    account_holder_name: 'Michael Chen',
  },
};

const GetPayoutResponseExample = CreatePayoutResponseExample;

const ListPayoutsResponseExample = [CreatePayoutResponseExample];
const CancelPayoutResponseExample = CreatePayoutResponseExample;
const GetPaymnentChannelsExample = [
  {
    channel_code: 'ID_BSI',
    channel_category: 'BANK',
    currency: 'IDR',
    channel_name: 'Bank Syariah Indonesia',
    amount_limits: {
      minimum: 10000,
      maximum: 1999999999999,
      minimum_increment: 1,
    },
  },
  {
    channel_code: 'PH_AUB',
    channel_category: 'BANK',
    currency: 'PHP',
    channel_name: 'Asia United Bank',
    amount_limits: {
      minimum: 1,
      maximum: 100000000,
      minimum_increment: 1,
    },
  },
];

describe('payouts/index', () => {
  afterEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
  });

  it('create_payout - success', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({ status: 200, json: async () => CreatePayoutResponseExample }),
    );
    const res = await create_payout(CreatePayoutRequestExample);
    expect(res).toEqual(v.parse(CreatePayoutResponseSchema, CreatePayoutResponseExample));
  });

  it('get_payout - success', async () => {
    mockGet.mockResolvedValueOnce(partial_mockKyResponse({ status: 200, json: async () => GetPayoutResponseExample }));
    const res = await get_payout({ payout_id: GetPayoutResponseExample.id });
    expect(res).toEqual(v.parse(GetPayoutResponseSchema, GetPayoutResponseExample));
  });

  it('get_payout_by_reference_id - success', async () => {
    mockGet.mockResolvedValueOnce(
      partial_mockKyResponse({ status: 200, json: async () => ListPayoutsResponseExample }),
    );
    const res = await get_payout_by_reference_id({ reference_id: CreatePayoutRequestExample.reference_id });
    expect(res).toEqual(v.parse(ListPayoutsResponseSchema, ListPayoutsResponseExample));
  });

  it('cancel_payout - success', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({ status: 200, json: async () => CancelPayoutResponseExample }),
    );
    const res = await cancel_payout({ payout_id: CancelPayoutResponseExample.id });
    expect(res).toEqual(v.parse(CancelPayoutResponseSchema, CancelPayoutResponseExample));
  });

  it('get_payment_channels - success', async () => {
    mockGet.mockResolvedValueOnce(
      partial_mockKyResponse({ status: 200, json: async () => GetPaymnentChannelsExample }),
    );
    const res = await get_payment_channels({});
    expect(res).toEqual(v.parse(GetPaymentChannelsResponseSchema, GetPaymnentChannelsExample));
  });

  it('get_payment_channels - builds search params correctly (all fields)', async () => {
    mockGet.mockResolvedValueOnce(
      partial_mockKyResponse({ status: 200, json: async () => GetPaymnentChannelsExample }),
    );

    const req = { channel_name: 'Bank Syariah', channel_category: 'BANK', channel_code: 'ID_BSI' };
    await get_payment_channels(req);

    expect(mockGet).toHaveBeenCalledWith('v2/payouts/channels', {
      searchParams: {
        channel_name: req.channel_name,
        channel_category: req.channel_category,
        channel_code: req.channel_code,
      },
    });
  });

  it('get_payment_channels - builds search params correctly (partial fields)', async () => {
    mockGet.mockResolvedValueOnce(
      partial_mockKyResponse({ status: 200, json: async () => GetPaymnentChannelsExample }),
    );

    const req = { channel_code: 'PH_AUB' };
    await get_payment_channels(req);

    expect(mockGet).toHaveBeenCalledWith('v2/payouts/channels', {
      searchParams: { channel_code: req.channel_code },
    });
  });

  it('create_payout - API error', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 400,
        json: async () => ({ error_code: 'INVALID_REQUEST', message: 'Bad', errors: [] }),
      }),
    );
    await expect(create_payout(CreatePayoutRequestExample)).rejects.toThrow();
  });

  it('get_payout - API error', async () => {
    mockGet.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 404,
        json: async () => ({ error_code: 'NOT_FOUND', message: 'Missing', errors: [] }),
      }),
    );
    await expect(get_payout({ payout_id: 'disb-unknown' })).rejects.toThrow();
  });

  it('get_payout_by_reference_id - API error', async () => {
    mockGet.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 500,
        json: async () => ({ error_code: 'ERR', message: 'Err', errors: [] }),
      }),
    );
    await expect(get_payout_by_reference_id({ reference_id: 'ref-unknown' })).rejects.toThrow();
  });

  it('cancel_payout - API error', async () => {
    mockPost.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 403,
        json: async () => ({ error_code: 'FORBIDDEN', message: 'No', errors: [] }),
      }),
    );
    await expect(cancel_payout({ payout_id: 'disb-unknown' })).rejects.toThrow();
  });

  it('get_payment_channels - API error', async () => {
    mockGet.mockResolvedValueOnce(
      partial_mockKyResponse({
        status: 401,
        json: async () => ({ error_code: 'UNAUTH', message: 'No', errors: [] }),
      }),
    );
    await expect(get_payment_channels({})).rejects.toThrow();
  });
});
