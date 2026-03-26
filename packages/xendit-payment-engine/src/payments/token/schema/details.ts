import * as z from 'zod';

export const TokenDetailsSchema = z.record(z.string(), z.unknown()).meta({
  description: 'Account information provided by the payment method provider. Fields returned are provider-dependent.',
  example: { account_number: '0001234567', bank: 'BCA' },
});
