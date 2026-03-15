import * as z from 'zod';

export const EmploymentSchema = z
  .object({
    employer_name: z.string().max(255).min(1).optional().describe('Name of the employer'),
    nature_of_business: z.string().max(255).min(1).optional().describe('Industry or nature of business'),
    role_description: z.string().max(255).min(1).optional().describe('Occupation or title'),
  })
  .meta({ description: 'Employment details for individual customer', example: { employer_name: 'ACME' } });
