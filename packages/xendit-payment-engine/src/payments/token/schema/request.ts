import * as z from 'zod';

export const GetPaymentTokenStatusRequestSchema = z.object({
  payment_token_id: z
    .string()
    .regex(/^[a-zA-Z0-9-]{39}$/)
    .meta({
      description: 'The identifier for the payment token',
      example: 'pt-56ef1da0-6c92-490a-9ea8-803eaf404ce1',
    }),
});
