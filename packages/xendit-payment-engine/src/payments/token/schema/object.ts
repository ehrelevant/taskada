import * as z from 'zod';
import { CountrySchema, CurrencySchema, DatetimeSchema, MetadataSchema } from '@standard/schema';

import { ActionSchema } from './action';
import { TokenChannelPropertiesSchema } from './channel_properties';
import { TokenDetailsSchema } from './details';

export const PaymentTokenObjectSchema = z
  .object({
    payment_token_id: z.string('Invalid payment_token_id.').meta({
      description:
        'Xendit unique Payment Token ID generated as reference for reusable payment details of the end user.',
      example: 'pt-cc3938dc-c2a5-43c4-89d7-7570793348c2',
    }),
    channel_code: z.string('Invalid channel_code.').optional().meta({
      description: 'Channel code used to select the payment method provider.',
      example: 'SHOPEEPAY',
    }),
    country: CountrySchema,
    business_id: z.string('Invalid business_id.').optional().meta({
      description: 'Xendit-generated identifier for the business that owns the transaction.',
      example: '5f27a14a9bf05c73dd040bc8',
    }),
    customer_id: z.string('Invalid customer_id.').optional().meta({
      description: 'Xendit unique Capture ID generated as reference for the end user.',
      example: 'cust-b98d6f63-d240-44ec-9bd5-aa42954c4f48',
    }),
    reference_id: z.string('Invalid reference_id.').optional().meta({
      description: 'A Reference ID from merchants to identify their request.',
      example: 'order-123',
    }),
    currency: CurrencySchema,
    channel_properties: TokenChannelPropertiesSchema.optional(),
    actions: z.array(ActionSchema).optional(),
    status: z
      .enum(['REQUIRES_ACTION', 'PENDING', 'ACTIVE', 'FAILED', 'EXPIRED', 'CANCELED'])
      .meta({ description: 'Status of the payment token.', example: 'ACTIVE' }),
    token_details: TokenDetailsSchema.optional(),
    failure_code: z
      .enum([
        'ACCOUNT_ALREADY_LINKED',
        'INVALID_ACCOUNT_DETAILS',
        'AUTHENTICATION_FAILED',
        'CARD_DECLINED',
        'CAPTURE_AMOUNT_EXCEEDED ',
        'INSUFFICIENT_BALANCE',
        'ISSUER_UNAVAILABLE',
        'CHANNEL_UNAVAILABLE',
        'INVALID_MERCHANT_SETTINGS',
      ])
      .optional()
      .meta({
        description: 'Failure codes for payment tokens.',
        example: 'AUTHENTICATION_FAILED',
      }),
    description: z.string('Invalid description.').optional().meta({
      description: 'A custom description for the Payment Request.',
      example: 'Payment for your order #123',
    }),
    metadata: MetadataSchema,
    created: DatetimeSchema.optional().meta({
      description: 'ISO 8601 date-time string when the token was created.',
      example: '2021-12-31T23:59:59Z',
    }),
    updated: DatetimeSchema.optional().meta({
      description: 'ISO 8601 date-time string when the token was last updated.',
      example: '2021-12-31T23:59:59Z',
    }),
  })
  .meta({
    description: 'Payment Token object',
    example: { payment_token_id: 'pt-cc3938dc-c2a5-43c4-89d7-7570793348c2', status: 'ACTIVE' },
  });

export default PaymentTokenObjectSchema;
