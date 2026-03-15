import * as z from 'zod';
import { MetadataSchema } from '@standard/schema';
import { SessionIndividualDetailSchema  } from './individual_detail';


export const SessionCustomerDetailsSchema = z
  .object({
    type: z.enum(['INDIVIDUAL']).meta({ description: 'Type of customer.' }),
    reference_id: z
      .string()
      .min(1)
      .max(255)
      .meta({
        description:
          'Merchant provided identifier for the customer. Must be unique. Alphanumeric no special characters allowed.',
        example: 'cust-123',
      }),
    email: z
      .string()
      .min(4)
      .max(50)
      .optional()
      .meta({ description: 'E-mail address of customer. Maximum length 50 characters.' }),
    mobile_number: MetadataSchema.optional(),
    individual_detail: SessionIndividualDetailSchema,
  })
  .meta({
    description: 'Customer details for a payment session',
    example: [{ type: 'INDIVIDUAL', reference_id: 'ref-1' }],
  });
