import * as z from 'zod';

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

export type Payout = z.infer<typeof PayoutSchema>;
export type CancelPayoutRequest = z.input<typeof CancelPayoutRequestSchema>;
export type CancelPayoutResponse = z.infer<typeof CancelPayoutResponseSchema>;
export type CreatePayoutRequest = z.input<typeof CreatePayoutRequestSchema>;
export type CreatePayoutResponse = z.infer<typeof CreatePayoutResponseSchema>;
export type GetPaymentChannelsRequest = z.input<typeof GetPaymentChannelsRequestSchema>;
export type GetPaymentChannelsResponse = z.infer<typeof GetPaymentChannelsResponseSchema>;
export type GetPayoutRequest = z.input<typeof GetPayoutRequestSchema>;
export type GetPayoutResponse = z.infer<typeof GetPayoutResponseSchema>;
export type ListPayoutsRequest = z.input<typeof ListPayoutsRequestSchema>;
export type ListPayoutsResponse = z.infer<typeof ListPayoutsResponseSchema>;
