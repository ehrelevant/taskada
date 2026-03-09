import * as v from 'valibot';

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
  PayoutSchema,
} from './schema';

export type Payout = v.InferInput<typeof PayoutSchema>;
export type CancelPayoutRequest = v.InferInput<typeof CancelPayoutRequestSchema>;
export type CancelPayoutResponse = v.InferInput<typeof CancelPayoutResponseSchema>;
export type CreatePayoutRequest = v.InferInput<typeof CreatePayoutRequestSchema>;
export type CreatePayoutResponse = v.InferInput<typeof CreatePayoutResponseSchema>;
export type GetPaymentChannelsRequest = v.InferInput<typeof GetPaymentChannelsRequestSchema>;
export type GetPaymentChannelsResponse = v.InferInput<typeof GetPaymentChannelsResponseSchema>;
export type GetPayoutRequest = v.InferInput<typeof GetPayoutRequestSchema>;
export type GetPayoutResponse = v.InferInput<typeof GetPayoutResponseSchema>;
export type ListPayoutsRequest = v.InferInput<typeof ListPayoutsRequestSchema>;
export type ListPayoutsResponse = v.InferInput<typeof ListPayoutsResponseSchema>;
