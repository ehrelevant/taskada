import client from '@src/client';
import { v4 as uuid4 } from 'uuid';

import type {
  CancelPayoutRequest,
  CancelPayoutResponse,
  CreatePayoutRequest,
  CreatePayoutResponse,
  GetPaymentChannelsRequest,
  GetPaymentChannelsResponse,
  GetPayoutRequest,
  GetPayoutResponse,
  ListPayoutsRequest,
  ListPayoutsResponse,
} from './types';
import {
  CancelPayoutRequestSchema,
  CancelPayoutResponseSchema,
  CreatePayoutRequestSchema,
  CreatePayoutResponseSchema,
  GetPaymentChannelsRequestSchema,
  GetPaymentChannelsResponseSchema,
  GetPayoutRequestSchema,
  GetPayoutResponseSchema,
  ListPayoutsRequestSchema,
  ListPayoutsResponseSchema,
} from './schema';

async function create_payout(request: CreatePayoutRequest): Promise<CreatePayoutResponse> {
  const validated_request = CreatePayoutRequestSchema.parse(request);
  const response = await client.post(`v2/payouts`, {
    body: JSON.stringify(validated_request),
    headers: { 'idempotency-key': uuid4() },
  });

  return CreatePayoutResponseSchema.parse(await response.json());
}

async function get_payout(request: GetPayoutRequest): Promise<GetPayoutResponse> {
  const validated_request = GetPayoutRequestSchema.parse(request);
  const response = await client.get(`v2/payouts/${validated_request.payout_id}`);

  return GetPayoutResponseSchema.parse(await response.json());
}

async function get_payout_by_reference_id(request: ListPayoutsRequest): Promise<ListPayoutsResponse> {
  const validated_request = ListPayoutsRequestSchema.parse(request);
  const response = await client.get(`v2/payouts/`, {
    searchParams: { reference_id: validated_request.reference_id },
  });

  return ListPayoutsResponseSchema.parse(await response.json());
}

async function cancel_payout(request: CancelPayoutRequest): Promise<CancelPayoutResponse> {
  const validated_request = CancelPayoutRequestSchema.parse(request);
  const response = await client.post(`v2/payouts/${validated_request.payout_id}/cancel`);

  return CancelPayoutResponseSchema.parse(await response.json());
}

async function get_payment_channels(request: GetPaymentChannelsRequest): Promise<GetPaymentChannelsResponse> {
  const validated_request = GetPaymentChannelsRequestSchema.parse(request);
  const params: Record<string, string> = {};
  if (validated_request.currency) params.currency = validated_request.currency;
  if (validated_request.channel_category) params.channel_category = validated_request.channel_category;
  if (validated_request.channel_code) params.channel_code = validated_request.channel_code;

  const response = await client.get('v2/payouts/channels', { searchParams: params });

  return GetPaymentChannelsResponseSchema.parse(await response.json());
}

export { create_payout, get_payout, get_payout_by_reference_id, cancel_payout, get_payment_channels };
