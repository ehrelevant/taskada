import * as z from 'zod';

export const IdentityAccountSchema = z
  .object({
    type: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'BANK_ACCOUNT']).meta({ description: 'Type of identity account' }),
    company: z.string().meta({ description: 'Financial institution or company name' }),
    description: z.string().meta({ description: 'Description of the account' }),
    country: z.string().min(2).max(2).meta({ description: 'ISO 3166-1 alpha-2 Country Code' }),
    properties: z
      .record(z.string(), z.any())
      .meta({ description: 'Additional properties specific to the account type' }),
  })
  .meta({ description: 'Identity account used for verification', example: { type: 'BANK_ACCOUNT', company: 'BPI' } });
