import * as z from 'zod';

export const SessionIndividualDetailSchema = z
  .object({
    given_names: z
      .string()
      .regex(/^[a-zA-Z]{1,50}$/)
      .meta({ description: 'Primary or first name/s of customer. Alphanumeric. No special characters is allowed.' }),
    surname: z
      .string()
      .regex(/^[a-zA-Z]{1,50}$/)
      .meta({ description: 'Last or family name of customer. Alphanumeric. No special characters is allowed.' }),
    nationality: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .optional()
      .meta({ description: 'Country code for customer nationality. ISO 3166-1 alpha-2 Country Code.' }),
    place_of_birth: z
      .string()
      .min(1)
      .max(60)
      .optional()
      .meta({
        description:
          'City or other relevant location for the customer birth place. Alphanumeric. No special characters is allowed.',
      }),
    date_of_birth: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().meta({ description: 'Gender of customer.' }),
  })
  .meta({
    description: 'Individual detail schema for session customer',
    example: [{ given_names: 'First', surname: 'Last' }],
  });
