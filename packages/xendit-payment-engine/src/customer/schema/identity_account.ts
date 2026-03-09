import * as v from 'valibot';

export const IdentityAccountSchema = v.object({
  type: v.pipe(v.picklist(['CREDIT_CARD', 'DEBIT_CARD', 'BANK_ACCOUNT']), v.description('Type of identity account')),
  company: v.pipe(v.string(), v.description('Financial institution or company name')),
  description: v.pipe(v.string(), v.description('Description of the account')),
  country: v.pipe(v.string(), v.minLength(2), v.maxLength(2), v.description('ISO 3166-1 alpha-2 Country Code')),
  properties: v.pipe(v.object({}), v.description('Additional properties specific to the account type')),
});
