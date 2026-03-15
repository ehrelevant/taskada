import * as z from 'zod';

export const CurrencySchema = z
  .enum(['IDR', 'PHP', 'VND', 'THB', 'SGD', 'MYR', 'USD', 'HKD', 'AUD', 'GBP', 'EUR', 'JPY', 'MXN'])
  .meta({ description: 'ISO 4217 three-letter currency code for the payment.' });

export default CurrencySchema;
