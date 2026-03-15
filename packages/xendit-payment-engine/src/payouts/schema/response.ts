import * as z from 'zod';

import { PayoutSchema } from './payout';

export const CreatePayoutResponseSchema = PayoutSchema;

export const GetPaymentChannelsResponseSchema = z.array(
  z.object({
    channel_name: z.string().describe('Name of payout channel'),
    channel_category: z.enum(['BANK', 'EWALLET', 'OTC']),
    channel_code: z
      .string()
      .describe(
        'Channel code of destination bank, E-Wallet or OTC channel. List of supported channels can be found in https://docs.xendit.co/docs/payouts-coverage-philippines',
      ),
    currency: z
      .string()
      .regex(/^[a-zA-Z]{3}$/)
      .describe('ISO 4217 Currency Code'),
    amount_limits: z.object({
      minimum: z.number().describe('Minimum amount that can be paid out to this channel'),
      maximum: z.number().describe('Maximum amount that can be paid out to this channel'),
      minimum_increment: z.number().describe('Smallest amount increment allowed by the channel'),
    }),
  }),
);

export const CancelPayoutResponseSchema = PayoutSchema;

export const GetPayoutResponseSchema = PayoutSchema;
export const ListPayoutsResponseSchema = z.array(PayoutSchema);
