import * as z from 'zod';
import { MetadataSchema } from '@standard/schema';

import { ChannelPropertiesSchema } from './channel_properties';
import { ItemSchema } from './item';
import { SessionCustomerDetailsSchema } from './customer';

export const CreateSessionRequestSchema = z
  .object({
    reference_id: z
      .string()
      .min(1)
      .max(64)
      .meta({ description: 'Your reference to uniquely identify the Payment Session.', example: 'ref-123' }),
    customer_id: z
      .string()
      .regex(/^[a-zA-Z0-9-]{41}$/)
      .meta({ description: 'Customer id' }),
    customer: SessionCustomerDetailsSchema.meta({ description: 'Customer details object for the payment session.' }),
    session_type: z.enum(['SAVE', 'PAY']).meta({ description: 'The use case for Payment Session.' }),
    allow_save_payment_method: z
      .enum(['DISABLED', 'OPTIONAL', 'FORCED'])
      .optional()
      .meta({ description: 'Option to save payment details from a customer for the PAY session_type.' }),
    currency: z
      .enum(['IDR', 'PHP', 'VND', 'THB', 'SGD', 'MYR', 'USD'])
      .meta({ description: 'ISO 4217 three-letter currency code for the payment.' }),
    amount: z.number().min(0).meta({
      description: 'The payment amount to be collected from the customer. For SAVE session_type, amount must be 0.',
    }),
    mode: z
      .enum(['PAYMENT_LINK', 'COMPONENTS'])
      .meta({ description: 'The frontend integration mode for Payment Session.' }),
    capture_method: z
      .enum(['AUTOMATIC', 'MANUAL'])
      .optional()
      .meta({ description: 'The method to capture the payment.' }),
    country: z
      .enum(['ID', 'PH', 'VN', 'TH', 'SG', 'MY'])
      .meta({ description: 'ISO 3166-1 alpha-2 two-letter country code for the payment.' }),
    channel_properties: ChannelPropertiesSchema.optional().meta({
      description: 'Channel properties object for the payment session.',
    }),
    allowed_payment_channels: z.array(z.string()).optional(),
    expires_at: z.string().optional(),
    locale: z
      .string()
      .regex(/^[a-zA-Z]{2}$/)
      .optional()
      .meta({ description: 'ISO 639-1 two-letter language code for Hosted Checkout page.' }),
    metadata: MetadataSchema.nullable().optional(),
    description: z.string().min(1).max(1000).optional().meta({ description: 'A custom description for the Session.' }),
    items: z.array(ItemSchema).nullable().optional(),
    success_return_url: z.string().optional(),
    cancel_return_url: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.session_type === 'SAVE' && data.amount !== 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'For SAVE session_type, the amount must be 0.',
        path: ['amount'],
      });
    }
  })
  .meta({ description: 'Create session request', example: [{ reference_id: 'ref-1', amount: 0 }] });

const SessionIdRequestSchema = z.object({
  session_id: z
    .string()
    .regex(/^[a-zA-Z0-9-]{27}$/)
    .meta({ description: 'Example:ps-661f87c614802d6c402cd82d' }),
});

export const GetSessionStatusRequestSchema = SessionIdRequestSchema;
export const CancelSessionRequestSchema = SessionIdRequestSchema;
