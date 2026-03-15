import * as z from 'zod';

import { CaptureSchema } from './captures';

export const PaymentSchema = z
  .object({
    payment_id: z
      .string()
      .min(1)
      .max(255)
      .meta({ description: 'Xendit unique Payment ID generated as reference for a payment.' }),
    business_id: z
      .string()
      .min(1)
      .max(255)
      .meta({ description: 'Xendit-generated identifier for the business that owns the transaction.' }),
    reference_id: z
      .string()
      .min(1)
      .max(255)
      .meta({ description: 'A Reference ID from merchants to identify their request.' }),
    payment_request_id: z.string().min(1).max(255).meta({
      description: 'Xendit unique Payment Request ID generated as reference after creation of payment request.',
    }),
    payment_token_id: z.string().min(1).max(255).meta({
      description:
        'Xendit unique Payment Token ID generated as reference for reusable payment details of the end user.',
    }),
    customer_id: z
      .string()
      .min(1)
      .max(41)
      .meta({ description: 'Xendit unique Capture ID generated as reference for the end user.' }),
    type: z
      .enum(['PAY', 'PAY_AND_SAVE', 'REUSABLE_PAYMENT_CODE'])
      .meta({ description: 'Payment collection intent type for the payment request.' }),
    country: z
      .enum(['ID', 'PH', 'VN', 'TH', 'SG', 'MY', 'HK', 'MX'])
      .meta({ description: 'ISO 3166-1 alpha-2 two-letter country code for the country of transaction.' }),
    currency: z
      .enum(['IDR', 'PHP', 'VND', 'THB', 'SGD', 'MYR', 'USD', 'HKD', 'AUD', 'GBP', 'EUR', 'JPY', 'MXN'])
      .meta({ description: 'ISO 4217 three-letter currency code for the payment.' }),
    request_amount: z
      .number()
      .min(0)
      .meta({ description: 'The intended payment amount to be collected from the end user.' }),
    capture_method: z.enum(['AUTOMATIC', 'MANUAL']).meta({ description: 'Payment capture method.' }),
    channel_code: z.string().meta({ description: 'Channel code used to select the payment method provider.' }),
    captures: z.array(CaptureSchema).optional(),
    status: z
      .enum(['AUTHORIZED', 'CANCELED', 'SUCCEEDED', 'FAILED', 'EXPIRED', 'PENDING'])
      .meta({ description: 'Status of the payment.' }),
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
        'PAYMENT_AMOUNT_LIMITS_EXCEEDED',
        'OTP_ATTEMPT_COUNTS_EXCEEDED',
        'CARD_DECLINED',
        'DECLINED_BY_ISSUER',
        'ISSUER_UNAVAILABLE',
        'INVALID_CVV',
        'DECLINED_BY_PROCESSOR',
        'CAPTURE_AMOUNT_EXCEEDED',
        'AUTHENTICATION_FAILED',
        'PROCESSOR_ERROR',
        'EXPIRED_CARD',
        'INACTIVE_OR_UNAUTHORIZED_CARD',
        'INVALID_MERCHANT_CREDENTIALS',
        'SUCCEEDED_FRAUDULENT',
      ])
      .optional(),
    metadata: z.record(z.string().max(40), z.string().max(500)).meta({ description: 'Custom metadata' }),
    created: z.string().meta({ description: 'ISO 8601 date-time format.' }),
    updated: z.string().meta({ description: 'ISO 8601 date-time format.' }),
    payment_details: z.object({}).optional(),
  })
  .meta({ description: 'Payment object', example: [{ payment_id: 'py-...' }] });
