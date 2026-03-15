import * as z from 'zod';
import { MetadataSchema } from '@standard/schema';

export const CreatePayoutRequestSchema = z
  .object({
    reference_id: z.string().min(1).max(255).describe('A reference to uniquely identify the Payout.'),
    channel_code: z.string().describe('Channel code of destination bank, E-Wallet or OTC channel.'),
    channel_properties: z
      .object({
        account_holder_name: z.string().describe("Name of account holder as per the bank or E-Wallet's records."),
        account_number: z
          .string()
          .min(1)
          .max(100)
          .describe('Account number of destination. Mobile numbers for E-Wallet accounts.'),
        account_type: z
          .string()
          .optional()
          .describe('Account type of the destination for currencies and channels that support proxy transfers.'),
      })
      .describe('Channel properties object (destination account details).'),
    amount: z.number().min(0).describe('Amount to be sent to the destination account.'),
    description: z
      .string()
      .min(1)
      .max(100)
      .optional()
      .describe('Description to send with the payout. Appears on recipient bank statements when supported.'),
    currency: z.enum(['IDR', 'PHP', 'VND', 'THB', 'SGD', 'MYR', 'USD']).describe('ISO 4217 Currency Code.'),
    receipt_notification: z
      .object({ emails: z.array(z.string().min(1).max(320)) })
      .optional()
      .describe(
        'Object containing email addresses to receive payout details upon successful Payout. Maximum of three email addresses each.',
      ),
    metadata: MetadataSchema,
  })
  .describe('Create Payout request schema.');

export const CancelPayoutRequestSchema = z.object({
  payout_id: z.string().regex(/^[a-zA-Z0-9-]{29}$/),
});

export const GetPaymentChannelsRequestSchema = z.object({
  channel_name: z.string().optional(),
  channel_category: z.enum(['BANK', 'EWALLET', 'OTC']).optional(),
  channel_code: z.string().optional(),
});

export const ListPayoutsRequestSchema = z.object({
  reference_id: z
    .string()
    .min(1)
    .max(255)
    .regex(/[a-zA-Z0-9-]*/),
});

export const GetPayoutRequestSchema = z.object({
  payout_id: z.string().regex(/[a-zA-Z0-9-]{29}/),
});
