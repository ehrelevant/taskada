import * as z from 'zod';
import { CountrySchema, CurrencySchema } from '@standard/schema';

export const PaymentRequestObjectSchema = z.object({
  business_id: z
    .string()
    .regex(/^[a-zA-Z0-9-]{1,64}$/)
    .meta({
      description: 'Xendit-generated identifier for the business that owns the transaction',
      example: ['5f27a14a9fb05c73dd040bc8'],
    }),
  reference_id: z
    .string()
    .regex(/^[a-zA-Z0-9-]{1,255}$/)
    .meta({
      description:
        'A reference ID from merchants to identify their request. For "CARDS" channel code, reference ID must be unique.',
      example: ['pr-1f02feb0-bb79-47ae-9d1e-e69394d3949c'],
    }),
  payment_request_id: z
    .string()
    .regex(/^[a-zA-Z0-9-]*$/)
    .meta({
      description: 'Xendit unique Payment Request ID generated as reference after creation of payment request.',
      example: ['pr-1f02feb0-bb79-47ae-9d1e-e69394d3949c'],
    }),
  payment_token_id: z
    .string()
    .regex(/^[a-zA-Z0-9-]*$/)
    .meta({
      description:
        'Xendit unique Payment Token ID generated as reference for reusable payment details of the end user.',
      example: ['pt-cc3938dc-c2a5-43c4-89d7-757079348c2b'],
    }),
  customer_id: z
    .string()
    .regex(/^[a-zA-Z0-9-]{3,41}$/)
    .meta({
      description: 'Xendit unique Capture ID generated as reference for the end user',
      example: ['cus-b98d6f63-d240-4ec-9bd5-aa42954c4f48'],
    }),
  latest_payment_id: z
    .string()
    .regex(/^[a-zA-Z0-9-]*$/)
    .meta({
      description: 'Latest Payment ID linked to the payment request.',
      example: ['py-1402feb0-bb79-47ae-9d1e-e69394d3949c'],
    }),
  type: z.enum(['PAY', 'PAY_AND_SAVE', 'REUSABLE_PAYMENT_CODE']).meta({
    description: 'The payment collection intent type for the payment request.',
    example: ['PAY'],
  }),
  country: CountrySchema,
  currency: CurrencySchema,
  request_amount: z
    .number()
    .min(0)
    .meta({
      description: 'The intended amount to be collected from the end user.',
      example: [10000.0],
    }),
  capture_method: z
    .enum(['AUTOMATIC', 'MANUAL'])
    .default('AUTOMATIC')
    .meta({
      description:
        "Payment capture will be processed immediately after payment request is created or requires merchant's trigger.",
      example: ['AUTOMATIC'],
    }),
  channel_code: z.string().meta({
    description: 'Channel code used to select the payment method provider.',
    example: ['CARD'],
  }),
  channel_properties: z.record(z.string(), z.any()).meta({
    description: 'Data required to initiate transaction with payment method provider.',
    example: [{}], // Replace with actual example if available
  }),
  actions: z.array(z.record(z.string(), z.any())).meta({
    description:
      'Actions object contains possible next steps merchants can take to proceed with payment collection from end user.',
    example: [{}], // Replace with actual example if available
  }),
  status: z
    .enum(['ACCEPTING_PAYMENTS', 'REQUIRES_ACTION', 'AUTHORIZED', 'CANCELED', 'EXPIRED', 'SUCCEEDED', 'FAILE[D'])
    .meta({
      description: 'Status of the payment request.',
      example: ['SUCCEEDED'],
    }),
  failure_code: z
    .enum([
      'ACCOUNT_ACCESS_BLOCKED',
      'INVALID_MERCHANT_SETTINGS',
      'INVALID_ACCOUNT_DETAILS',
      'PAYMENT_ATTEMPT_COUNTS_EXCEEDED',
      'USER_DEVICE_UNREACHABLE',
      'CHANNEL_UNAVAILABLE',
      'INSUFFICIENT_BALANCE',
      'ACCOUNT_NOT_ACTIVATED',
      'INVALID_TOKEN',
      'SERVER_ERROR',
      'PARTNER_TIMEOUT_ERROR',
      'TIMEOUT_ERROR',
      'USER_DECLINED_PAYMENT',
      'USER_DID_NOT_AUTHORIZE',
      'PAYMENT_REQUEST_EXPIRED',
      'FAILURE_DETAILS_UNAVAILABLE',
      'EXPIRED_OTP',
      'INVALID_OTP',
      'PAYMENT_AMOUNT_LIMITS_EXCEEDED',
      'OTP_ATTEMPT_COUNTS_EXCEEDED',
      'CARD_DECLINED',
      'DECLINED_BY_ISSUER',
      'ISSUER_UNAVAILABLE',
      'INVALID_CVV',
      'DECLINED_BY_PROCESSOR',
      'CAPTURE_AMOUNT_EXCEEDED ',
      'AUTHENTICATION_FAILED',
      'PROCESSOR_ERROR',
      'EXPIRED_CARD',
      'STOLEN_CARD',
      'INACTIVE_OR_UNAUTHORIZED_CARD',
      'INVALID_MERCHANT_CREDENTIALS',
      'SUSPECTED_FRAUDULENT',
    ])
    .meta({
      description: 'Failure codes for payments.',
      example: ['CARD_DECLINED'],
    }),
  description: z
    .string()
    .min(1)
    .max(1000)
    .meta({
      description: 'A custom description for the Payment Request.',
      example: ['Payment for your order #123'],
    }),
  metadata: z.record(z.string(), z.any()).meta({
    description: 'Key-value entries for your custom data.',
    example: [{ my_custom_id: 'merchant-123', my_custom_order_id: 'order-123' }],
  }),
  items: z.array(z.record(z.string(), z.any())).meta({
    description: 'Array of objects describing the item(s) attached to the payment.',
    example: [{}], // Replace with actual example if available
  }),
  shipping_information: z.record(z.string(), z.any()).meta({
    description: 'Shipping information object.',
    example: [{}], // Replace with actual example if available
  }),
  created: z.string().meta({
    description: 'ISO 8601 date-time format.',
    example: ['2021-12-31T23:59:59Z'],
  }),
  updated: z.string().meta({
    description: 'ISO 8601 date-time format.',
    example: ['2021-12-31T23:59:59Z'],
  }),
});
