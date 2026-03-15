import * as z from 'zod';

import { EmploymentSchema } from './employment';

export const IndividualDetailSchema = z
  .object({
    given_names: z
      .string()
      .regex(/^[a-zA-Z0-9]{1,50}$/)
      .meta({ description: 'Primary or first name/s of customer. Alphanumeric. No special characters is allowed.' }),
    surname: z
      .string()
      .regex(/^[a-zA-Z0-9]{1,50}$/)
      .nullable()
      .optional()
      .meta({ description: 'Last or family name of customer. Alphanumeric. No special characters is allowed.' }),
    nationality: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .nullable()
      .optional()
      .meta({ description: 'Country code for customer nationality. ISO 3166-1 alpha-2 Country Code' }),
    place_of_birth: z
      .string()
      .regex(/^[a-zA-Z0-9]{1,60}$/)
      .nullable()
      .optional()
      .meta({
        description:
          'City or other relevant location for the customer birth place. Alphanumeric. No special characters is allowed.',
      }),
    date_of_birth: z.string().nullable().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).nullable().optional().meta({ description: 'Gender of customer' }),
    employment: EmploymentSchema.nullable().optional(),
  })
  .meta({ description: 'Individual details for a customer', example: { given_names: 'Juan', surname: 'Dela Cruz' } });
