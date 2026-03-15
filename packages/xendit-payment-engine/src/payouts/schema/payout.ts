import * as z from 'zod';
import { MetadataSchema } from '@standard/schema';

export const PayoutSchema = z
  .object({
    id: z.string().min(29).max(29).describe('Xendit-generated unique identifier for each payout.'),
    amount: z.number().min(0).describe('Amount to be sent to the destination account.'),
    channel_code: z.string().describe('Channel code of destination bank, E-Wallet or OTC channel.'),
    currency: z.string().describe('ISO 4217 Currency Code.'),
    reference_id: z.string().min(1).max(255).describe('A reference to uniquely identify the Payout.'),
    status: z
      .enum(['ACCEPTED', 'REQUESTED', 'FAILED', 'SUCCEEDED', 'CANCELLED', 'REVERSED'])
      .describe('Status of the payout.'),
    created: z.string().describe('Timestamp when the payout request was made (ISO 8601).'),
    updated: z.string().describe('Timestamp when the payout request was updated (ISO 8601).'),
    estimated_arrival_time: z
      .string()
      .optional()
      .describe('Estimated time of arrival of funds in destination account (ISO 8601).'),
    failure_code: z
      .enum([
        'INSUFFICIENT_BALANCE',
        'INVALID_DESTINATION',
        'REJECTED_BY_CHANNEL',
        'TEMPORARY_TRANSFER_ERROR',
        'TRANSFER_ERROR',
        'UNKNOWN_BANK_NETWORK_ERROR',
        'DESTINATION_MAXIMUM_LIMIT',
      ])
      .optional()
      .describe('Failure code when the payout failed.'),
    business_id: z.string().optional().describe('Your Xendit Business ID.'),
    channel_properties: z
      .object({
        account_holder_name: z
          .string()
          .min(1)
          .max(100)
          .optional()
          .describe("Name of account holder as per the bank or E-Wallet's records."),
        account_number: z
          .string()
          .min(1)
          .max(100)
          .optional()
          .describe('Account number of destination. Mobile numbers for E-Wallet accounts.'),
        account_type: z.string().optional().describe('Account type of the destination.'),
      })
      .optional()
      .describe('Channel properties object (destination account details).'),
    receipt_notification: z
      .object({
        email_to: z.array(z.string().email()).optional(),
        email_cc: z.array(z.string().email()).optional(),
        email_bcc: z.array(z.string().email()).optional(),
      })
      .optional()
      .describe('Object containing email addresses to receive payout details upon successful Payout.'),
    metadata: MetadataSchema,
  })
  .describe('Payout object.');
