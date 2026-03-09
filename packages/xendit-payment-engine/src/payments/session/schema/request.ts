import * as v from 'valibot';
import { CustomerIdFieldSchema } from '@customer/schema';
import { MetadataSchema } from '@standard/schema';

import { ItemSchema } from './item';
import { SessionCustomerDetailsSchema } from './customer';

export const CreateSessionRequestSchema = v.pipe(
  v.object({
    reference_id: v.pipe(
      v.string(),
      v.minLength(1),
      v.maxLength(64),
      v.description(
        'Your reference to uniquely identify the Payment Session. This is commonly used to identify your order or transaction.',
      ),
    ),
    customer_id: CustomerIdFieldSchema,
    customer: v.pipe(SessionCustomerDetailsSchema, v.description('Customer details object for the payment session.')),
    session_type: v.pipe(
      v.picklist(['SAVE', 'PAY']),
      v.description(
        'The use case for Payment Session. SAVE: save the payment details for future payments. PAY: collects a one-time payment from a customer.',
      ),
    ),
    allow_save_payment_method: v.optional(
      v.pipe(
        v.picklist(['DISABLED', 'OPTIONAL', 'FORCED']),
        v.description(
          'Option to save payment details from a customer for the PAY session_type. DISABLED: does not save the payment details. OPTIONAL: allows the customer to opt-in to save the payment details. FORCED: always save the payment details.',
        ),
      ),
    ),
    currency: v.pipe(
      v.picklist(['IDR', 'PHP', 'VND', 'THB', 'SGD', 'MYR', 'USD']),
      v.description('ISO 4217 three-letter currency code for the payment.'),
    ),
    amount: v.pipe(
      v.number(),
      v.minValue(0),
      v.description('The payment amount to be collected from the customer. For SAVE session_type, amount must be 0.'),
    ),
    mode: v.pipe(
      v.picklist(['PAYMENT_LINK', 'COMPONENTS']),
      v.description(
        'The frontend integration mode for Payment Session. PAYMENT_LINK: redirect customer to the Xendit Hosted Checkout page. COMPONENTS: collect payment details from customer with Xendit Component SDK.',
      ),
    ),
    capture_method: v.optional(
      v.pipe(
        v.picklist(['AUTOMATIC', 'MANUAL']),
        v.description(
          'The method to capture the payment. AUTOMATIC: capture the payment automatically. MANUAL: capture the payment manually using Payment Capture API.',
        ),
      ),
    ),
    country: v.pipe(
      v.picklist(['ID', 'PH', 'VN', 'TH', 'SG', 'MY']),
      v.description('ISO 3166-1 alpha-2 two-letter country code for the payment.'),
    ),
    channel_properties: v.optional(
      v.pipe(v.object({}), v.description('Channel properties object for the payment session.')),
    ),
    allowed_payment_channels: v.optional(v.array(v.string())),
    expires_at: v.optional(v.string()),
    locale: v.optional(
      v.pipe(
        v.string(),
        v.regex(/^[a-zA-Z]{2}$/),
        v.description('ISO 639-1 two-letter language code for Hosted Checkout page.'),
      ),
      'en',
    ),
    metadata: MetadataSchema,
    description: v.optional(
      v.pipe(
        v.string(),
        v.minLength(1),
        v.maxLength(1000),
        v.description(
          'A custom description for the Session. This text will be displayed on the Xendit Hosted Checkout page.',
        ),
      ),
    ),
    items: v.nullable(v.array(ItemSchema)),
    success_return_url: v.optional(v.string()),
    cancel_return_url: v.optional(v.string()),
  }),
  v.forward(
    v.partialCheck(
      [['session_type'], ['amount']],
      input => !(input.session_type === 'SAVE' && input.amount !== 0),
      // validate_amount,
      ' For SAVE session_type, the amount must be 0.',
    ),
    ['amount'],
  ),
);

const SessionIdRequestSchema = v.pipe(
  v.object({
    session_id: v.pipe(v.string(), v.regex(/^[a-zA-Z0-9-]{27}$/), v.description('Example:ps-661f87c614802d6c402cd82d')),
  }),
);

export const GetSessionStatusRequestSchema = SessionIdRequestSchema;
export const CancelSessionRequestSchema = SessionIdRequestSchema;
