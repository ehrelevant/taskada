import * as z from 'zod';

import {
  ActionSchema,
  GetPaymentTokenStatusRequestSchema,
  GetPaymentTokenStatusResponseSchema,
  PaymentTokenObjectSchema,
  TokenChannelPropertiesSchema,
  TokenDetailsSchema,
} from './schema';

export type Action = z.infer<typeof ActionSchema>;
export type TokenChannelProperties = z.infer<typeof TokenChannelPropertiesSchema>;
export type TokenDetails = z.infer<typeof TokenDetailsSchema>;
export type PaymentTokenObject = z.infer<typeof PaymentTokenObjectSchema>;

export type GetPaymentTokenStatusRequest = z.input<typeof GetPaymentTokenStatusRequestSchema>;
export type GetPaymentTokenStatusResponse = z.infer<typeof GetPaymentTokenStatusResponseSchema>;
