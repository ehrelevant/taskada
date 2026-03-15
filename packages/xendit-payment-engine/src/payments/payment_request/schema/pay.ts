import * as z from 'zod';
import { CountrySchema, CurrencySchema, MetadataSchema } from '@standard/schema';

import { PaymentRequestObjectSchema } from './object';

const CaptureMethodSchema = PaymentRequestObjectSchema.shape.capture_method;

export const PaymentRequestCustomerIndividualDetailSchema = z
  .object({
    given_names: z
      .string()
      .min(1)
      .max(50)
      .meta({ description: 'Customer given name(s)', example: ['John'] }),
    surname: z
      .string()
      .min(1)
      .max(50)
      .meta({ description: 'Customer family name', example: ['Doe'] }),
    nationality: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .optional()
      .meta({ description: 'Country code for customer nationality, ISO 3166-1 alpha-2', example: ['ID'] }),
    place_of_birth: z
      .string()
      .optional()
      .meta({ description: 'Place of birth', example: ['Jakarta'] }),
    date_of_birth: z
      .string()
      .optional()
      .meta({ description: 'Date of birth, YYYY-MM-DD', example: ['1990-01-01'] }),
    gender: z
      .enum(['MALE', 'FEMALE', 'OTHER'])
      .optional()
      .meta({ description: 'Gender of customer', example: ['MALE'] }),
  })
  .meta({
    description: 'Individual detail for the customer',
    example: [
      {
        given_names: 'Jane',
        surname: 'Roe',
        nationality: 'ID',
        date_of_birth: '1990-01-01',
      },
    ],
  });

export const PaymentRequestCustomerSchema = z
  .object({
    reference_id: z
      .string()
      .optional()
      .meta({ description: 'Merchant-provided identifier for the customer', example: ['cust-123'] }),
    customer_id: z
      .string()
      .optional()
      .meta({ description: 'Xendit customer id', example: ['cus-abc123'] }),
    type: z
      .enum(['INDIVIDUAL'])
      .optional()
      .meta({ description: 'Type of customer', example: ['INDIVIDUAL'] }),
    email: z
      .email()
      .optional()
      .meta({ description: 'Customer email address', example: ['user@example.com'] }),
    mobile_number: z
      .string()
      .optional()
      .meta({ description: 'Customer mobile number in E.164', example: ['+628123456789'] }),
    individual_detail: PaymentRequestCustomerIndividualDetailSchema.optional(),
  })
  .meta({
    description: 'Customer object for payment request',
    example: [{ reference_id: 'cust-123', email: 'a@b.com' }],
  });

export const PaymentRequestItemSchema = z
  .object({
    reference_id: z
      .string()
      .min(1)
      .max(255)
      .optional()
      .meta({ description: 'Merchant-provided identifier for the item', example: ['item-123'] }),
    type: z
      .enum(['DIGITAL_PRODUCT', 'PHYSICAL_PRODUCT', 'DIGITAL_SERVICE', 'PHYSICAL_SERVICE', 'FEE'])
      .meta({ description: 'Type of item', example: ['DIGITAL_PRODUCT'] }),
    name: z
      .string()
      .min(1)
      .max(255)
      .meta({ description: 'Name of item', example: ['House Cleaning'] }),
    net_unit_amount: z
      .number()
      .min(0)
      .meta({ description: 'Net amount to be charged per unit', example: [10000] }),
    quantity: z
      .number()
      .min(1)
      .meta({ description: 'Number of units in the basket', example: [1] }),
    url: z
      .url()
      .optional()
      .meta({ description: 'URL of the item', example: ['https://example.com/item.png'] }),
    image_url: z
      .string()
      .url()
      .optional()
      .meta({ description: 'Image URL for the item', example: ['https://example.com/image.png'] }),
    service: z
      .string()
      .optional()
      .meta({ description: 'Category for item', example: ['cleaning'] }),
    subcategory: z
      .string()
      .optional()
      .meta({ description: 'Sub-category for item', example: ['home'] }),
    description: z
      .string()
      .max(1025)
      .optional()
      .meta({ description: 'Description of the item', example: ['2-hour home cleaning'] }),
    metadata: z
      .record(z.string(), z.any())
      .optional()
      .meta({ description: 'Key-value metadata for the item', example: [{ sku: 'sku-123' }] }),
  })
  .meta({
    description: 'Item object for payment request',
    example: [{ name: 'Service', net_unit_amount: 10000, quantity: 1 }],
  });

export const PaymentRequestShippingInformationSchema = z
  .object({
    country: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .optional()
      .meta({ description: 'ISO 3166-1 alpha-2 country code', example: ['ID'] }),
    street_line1: z
      .string()
      .optional()
      .meta({ description: 'Street address line 1', example: ['Jl. Sudirman 1'] }),
    street_line2: z
      .string()
      .optional()
      .meta({ description: 'Street address line 2', example: ['Apt 10'] }),
    city: z
      .string()
      .optional()
      .meta({ description: 'City for shipping', example: ['Jakarta'] }),
    province_state: z
      .string()
      .optional()
      .meta({ description: 'Province or state', example: ['DKI Jakarta'] }),
    postal_code: z
      .string()
      .optional()
      .meta({ description: 'Postal code', example: ['12345'] }),
  })
  .meta({ description: 'Shipping information for the payment request', example: [{}] });

export const PaymentRequestPayRequestSchema = z
  .object({
    reference_id: z
      .string()
      .min(1)
      .max(255)
      .meta({ description: 'Merchant-provided identifier for the payment request', example: ['pr-123'] }),
    type: z.literal('PAY').meta({ description: 'Payment request intent type', example: ['PAY'] }),
    country: CountrySchema,
    currency: CurrencySchema,
    request_amount: z
      .number()
      .min(0)
      .meta({ description: 'Amount to collect from end user', example: [10000] }),
    capture_method: CaptureMethodSchema.optional(),
    channel_code: z
      .string()
      .meta({ description: 'Channel code used to select the payment method provider', example: ['CARD'] }),
    channel_properties: PaymentRequestObjectSchema.shape.channel_properties.optional(),
    description: z
      .string()
      .min(1)
      .max(1000)
      .optional()
      .meta({ description: 'Description for the payment request', example: ['Payment for your order #123'] }),
    metadata: MetadataSchema,
    customer: PaymentRequestCustomerSchema.optional(),
    items: z.array(PaymentRequestItemSchema).optional(),
    shipping_information: PaymentRequestShippingInformationSchema.optional(),
    expires_at: z
      .string()
      .optional()
      .meta({ description: 'Expiry in ISO 8601 datetime', example: ['2023-12-31T23:59:59Z'] }),
  })
  .meta({
    description: 'Payload to pay / create a payment request with payment details',
    example: [
      {
        reference_id: 'pr-123',
        type: 'PAY',
        country: 'ID',
        currency: 'IDR',
        request_amount: 10000,
        channel_code: 'CARD',
        description: 'Payment for order #123',
      },
    ],
  });

export const PaymentRequestPaySaveRequestSchema = PaymentRequestPayRequestSchema.extend({
  customer: PaymentRequestCustomerSchema.meta({
    description: 'Customer object is required when saving payment details',
  }),
  type: z.literal('PAY_AND_SAVE').meta({ description: 'Payment request intent type', example: ['PAY_AND_SAVE'] }),
}).meta({
  description: 'Payload to create a payment request and save payment details for future use (PAY_AND_SAVE)',
  example: [
    {
      reference_id: 'pr-123',
      type: 'PAY_AND_SAVE',
      country: 'ID',
      currency: 'IDR',
      request_amount: 10000,
      channel_code: 'CARD',
      customer: { reference_id: 'cust-123', email: 'a@b.com' },
    },
  ],
});

export const PaymentRequestPayTokenRequestSchema = PaymentRequestPayRequestSchema.extend({
  payment_token_id: z
    .string()
    .min(1)
    .max(255)
    .meta({
      description:
        'Xendit unique Payment Token ID generated as reference for reusable payment details of the end user.',
      example: ['pt-cc3938dc-c2a5-43c4-89d7-757079348c2b'],
    }),
  customer: PaymentRequestCustomerSchema.optional(),
}).meta({
  description: 'Payload to create a payment request using a stored payment token (pay with token).',
  example: [
    {
      reference_id: 'pr-123',
      type: 'PAY',
      country: 'ID',
      currency: 'IDR',
      request_amount: 10000,
      channel_code: 'CARD',
      payment_token_id: 'pt-cc3938dc-c2a5-43c4-89d7-757079348c2b',
    },
  ],
});

export const PaymentRequestReusablePaymentCodeRequestSchema = PaymentRequestPayRequestSchema.extend({
  type: z.literal('REUSABLE_PAYMENT_CODE'),
  channel_properties: PaymentRequestObjectSchema.shape.channel_properties,
  items: z
    .array(PaymentRequestItemSchema)
    .min(1)
    .meta({ description: 'Array of objects describing the item(s) attached to the payment.' }),
}).meta({
  description:
    'Payload to create a reusable payment code that can be used for multiple payments (REUSABLE_PAYMENT_CODE).',
  example: [
    {
      reference_id: 'pr-123',
      type: 'REUSABLE_PAYMENT_CODE',
      country: 'ID',
      currency: 'IDR',
      request_amount: 10000,
      channel_code: 'VA',
      channel_properties: {
        /* provider props */
      },
      items: [{ name: 'Service', net_unit_amount: 10000, quantity: 1 }],
    },
  ],
});
