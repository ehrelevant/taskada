import * as z from 'zod';

export const CountrySchema = z
  .enum(['ID', 'PH', 'VN', 'TH', 'SG', 'MY', 'HK', 'MX'])
  .meta({ description: 'ISO 3166-1 alpha-2 two-letter country code' });

export default CountrySchema;
