import * as z from 'zod';

const payment_request_id_field = z
  .string()
  .regex(/^[a-zA-Z0-9-]{39}$/)
  .meta({
    description: 'The Payment Request Id',
    example: 'pr-8877c08a-740d-4153-9816-3d744ed197a5',
  });

const payment_request_id_object = z.object({
  payment_request_id: payment_request_id_field,
});

export const GetPaymentRequestStatusRequestSchema = payment_request_id_object;

export const CancelPaymentRequestRequestSchema = payment_request_id_object;

export const SimulatePaymentRequestSchema = z.object({
  payment_request_id: payment_request_id_field,
  amount: z.number().meta({
    description: 'Amount to simulate',
    example: 100.0,
  }),
});
