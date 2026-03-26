import * as z from 'zod';

export const TokenChannelPropertiesSchema = z.record(z.string(), z.unknown()).meta({
  description:
    'Channel-specific properties required to initiate transaction with the payment method provider. Shape varies by channel.',
  example: { phone_number: '08123456789' },
});
