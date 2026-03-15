import * as z from 'zod';

export const StandardAddressSchema = z
  .object({
    country: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .meta({ description: 'ISO 3166-1 alpha-2 Country Code' }),
    street_line1: z
      .string()
      .min(1)
      .max(255)
      .meta({ description: 'Line 1 of street address e.g., building name and apartment number' }),
    street_line2: z
      .string()
      .min(1)
      .max(255)
      .nullable()
      .optional()
      .meta({ description: 'Line 2 of street address e.g., building name and apartment number' }),
    city: z
      .string()
      .min(1)
      .max(255)
      .nullable()
      .optional()
      .meta({ description: 'City, village or town of residence of customer' }),
    province_state: z
      .string()
      .min(1)
      .max(255)
      .nullable()
      .optional()
      .meta({ description: 'Province, state or region of residence of customer' }),
    postal_code: z.string().min(1).max(255).nullable().optional().meta({ description: 'ZIP/Postal Code of customer' }),
    category: z.enum(['HOME', 'WORK', 'PROVINCIAL']).nullable().optional().meta({ description: 'Address type' }),
    is_primary: z
      .boolean()
      .meta({ description: "Indicates that the information provided refers to the customer's primary address" }),
  })
  .meta({ description: 'Standard address object', example: [{ country: 'PH', street_line1: '-' }] });
