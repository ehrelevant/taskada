import * as z from 'zod';

import {
  BusinessDetailSchema,
  CreateCustomerRequestSchema,
  CreateCustomerResponseSchema,
  CustomerIdFieldSchema,
  CustomerSchema,
  DateofRegistrationSchema,
  DescriptionSchema,
  EmploymentSchema,
  GetCustomerListRequestSchema,
  GetCustomerListResponseSchema,
  GetCustomerRequestSchema,
  GetCustomerResponseSchema,
  IdentityAccountSchema,
  IndividualDetailSchema,
  KycDocumentsObjectSchema,
  StandardAddressSchema,
  UpdateCustomerRequestSchema,
  UpdateCustomerResponseSchema,
} from './schema';

export type Employment = z.infer<typeof EmploymentSchema>;
export type IndividualDetail = z.infer<typeof IndividualDetailSchema>;
export type BusinessDetail = z.infer<typeof BusinessDetailSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type IdentityAccount = z.infer<typeof IdentityAccountSchema>;
export type KycDocumentsObject = z.infer<typeof KycDocumentsObjectSchema>;
export type StandardAddress = z.infer<typeof StandardAddressSchema>;
export type GetCustomerRequest = z.input<typeof GetCustomerRequestSchema>;
export type GetCustomerListRequest = z.input<typeof GetCustomerListRequestSchema>;
export type GetCustomerListResponse = z.infer<typeof GetCustomerListResponseSchema>;
export type CreateCustomerRequest = z.input<typeof CreateCustomerRequestSchema>;
export type DateofRegistration = z.infer<typeof DateofRegistrationSchema>;
export type Description = z.infer<typeof DescriptionSchema>;
export type UpdateCustomerRequest = z.input<typeof UpdateCustomerRequestSchema>;
export type CustomerIdField = z.infer<typeof CustomerIdFieldSchema>;
export type GetCustomerResponse = z.infer<typeof GetCustomerResponseSchema>;
export type CreateCustomerResponse = z.infer<typeof CreateCustomerResponseSchema>;
export type UpdateCustomerResponse = z.infer<typeof UpdateCustomerResponseSchema>;
