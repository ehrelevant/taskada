import * as v from 'valibot';
import { MetadataSchema } from '@standard/schema';

export const CreatePayoutRequestSchema = v.pipe(
  v.object({
    reference_id: v.pipe(
      v.string(),
      v.minLength(1),
      v.maxLength(255),
      v.metadata({ example: 'myref-1482928194' }),
      v.description('A reference to uniquely identify the Payout.'),
    ),
    channel_code: v.pipe(
      v.string(),
      v.description('Channel code of destination bank, E-Wallet or OTC channel.'),
      v.metadata({ example: 'ID_BCA' }),
    ),
    channel_properties: v.pipe(
      v.object({
        account_holder_name: v.pipe(
          v.string(),
          v.description("Name of account holder as per the bank or E-Wallet's records."),
        ),
        account_number: v.pipe(
          v.string(),
          v.minLength(1),
          v.maxLength(100),
          v.description('Account number of destination. Mobile numbers for E-Wallet accounts.'),
          v.metadata({ example: '081234567890' }),
        ),
        account_type: v.optional(
          v.pipe(
            v.string(),
            v.description(
              'Account type of the destination for currencies and channels that support proxy transfers. Defaults to BANK_ACCOUNT when not provided.',
            ),
          ),
        ),
      }),
      v.description('Channel properties object (destination account details).'),
    ),
    amount: v.pipe(
      v.number(),
      v.minValue(0),
      v.description('Amount to be sent to the destination account.'),
      v.metadata({ example: 10000.0 }),
    ),
    description: v.optional(
      v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(100),
        v.description('Description to send with the payout. Appears on recipient bank statements when supported.'),
      ),
    ),
    currency: v.pipe(
      v.picklist(['IDR', 'PHP', 'VND', 'THB', 'SGD', 'MYR', 'USD']),
      v.description('ISO 4217 Currency Code.'),
    ),
    receipt_notification: v.optional(
      v.pipe(
        v.object({
          emails: v.array(v.pipe(v.string(), v.minLength(1), v.maxLength(320))),
        }),
        v.description(
          'Object containing email addresses to receive payout details upon successful Payout. Maximum of three email addresses each.',
        ),
      ),
    ),
    metadata: MetadataSchema,
  }),
  v.description('Create Payout request schema.'),
);

export const CancelPayoutRequestSchema = v.object({
  payout_id: v.pipe(
    v.string(),
    v.regex(/^[a-zA-Z0-9-]{29}$/),
    v.metadata({ example: 'disb-571f3644d2b4edf0745e9703' }),
  ),
});

export const GetPaymentChannelsRequestSchema = v.object({
  channel_name: v.optional(v.pipe(v.string())),
  channel_category: v.optional(v.pipe(v.string(), v.picklist(['BANK', 'EWALLET', 'OTC']))),
  channel_code: v.optional(v.pipe(v.string())),
});

export const ListPayoutsRequestSchema = v.object({
  reference_id: v.pipe(
    v.string(),
    v.minLength(1),
    v.maxLength(255),
    v.regex(/[a-zA-Z0-9-]*/),
    v.metadata({
      example: 'myref-1482928194',
    }),
  ),
});

export const GetPayoutRequestSchema = v.object({
  payout_id: v.pipe(
    v.string(),
    v.regex(/[a-zA-Z0-9-]{29}/),
    v.metadata({
      example: 'disb-571f3644d2b4edf0745e9703',
    }),
  ),
});
