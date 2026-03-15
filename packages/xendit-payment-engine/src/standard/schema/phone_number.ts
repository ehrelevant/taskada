import * as z from 'zod';

export const PhoneNumberSchema = z
  .string()
  .regex(/^((\+\d{1,15})|(0\d{7,15})|(\d{7,15}))$/)
  .nullable()
  .describe('Supports both E.164 international format (+) and local formats with or without a leading zero.');
