import * as z from 'zod';

import { CustomerSchema } from './customer';

export const GetCustomerListResponseSchema = z
  .object({
    data: z.array(CustomerSchema),
    has_more: z.boolean(),
  })
  .meta({ description: 'Response for listing customers' });

export const CreateCustomerResponseSchema = CustomerSchema;
export const UpdateCustomerResponseSchema = CustomerSchema;
export const GetCustomerResponseSchema = CustomerSchema;
