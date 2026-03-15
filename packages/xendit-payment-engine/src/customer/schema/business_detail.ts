import * as z from 'zod';

export const BusinessDetailSchema = z
  .object({
    business_name: z.string().min(1).max(255),
    business_category: z.string().max(255).nullable().optional(),
    business_field: z.string().max(255).nullable().optional(),
    business_type: z.string().max(255).nullable().optional(),
    business_registration_number: z.string().max(255).nullable().optional(),
    contact_person_name: z.string().max(255).nullable().optional(),
    monthly_sales: z.number().min(0).nullable().optional(),
    annual_sales: z.number().min(0).nullable().optional(),
    currency: z.string().min(3).max(3).nullable().optional().meta({ description: 'Currency code (3-letter ISO)' }),
  })
  .meta({ description: 'Business details for business customers', example: { business_name: 'ACME Co' } });
