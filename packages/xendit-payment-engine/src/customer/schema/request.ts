import * as z from 'zod';
import { MetadataSchema } from '@standard/schema';
import { PhoneNumberSchema } from '@standard/schema/phone_number';

import { BusinessDetailSchema } from './business_detail';
import { DateofRegistrationSchema, DescriptionSchema } from './customer';
import { IndividualDetailSchema } from './individual_detail';
import { KycDocumentsObjectSchema } from './kyc_document';
import { StandardAddressSchema } from './address';

export const GetCustomerRequestSchema = z.object({
  customer_id: z.string().max(41),
});

export const GetCustomerListRequestSchema = z.object({
  reference_id: z.string().regex(/^[a-zA-Z0-9]{1,255}$/),
});

export const CreateCustomerRequestSchema = z.object({
  individual_detail: IndividualDetailSchema.optional(),
  business_detail: BusinessDetailSchema.optional(),
  mobile_number: PhoneNumberSchema.optional(),
  phone_number: PhoneNumberSchema.optional(),
  email: z.string().min(1).max(50).nullable().optional().meta({ description: 'E-mail address of customer' }),
  addresses: StandardAddressSchema.optional(),
  kyc_documents: z.array(KycDocumentsObjectSchema).optional(),
  description: DescriptionSchema,
  date_of_registration: DateofRegistrationSchema,
  domicile_of_registration: z
    .string()
    .regex(/^[A-Z]{2}$/)
    .meta({ description: 'Country within which the account resides (ISO 3166-1 alpha-2)' }),
  metadata: MetadataSchema.optional(),
});

export const UpdateCustomerRequestSchema = z.object({
  individual_detail: IndividualDetailSchema.optional(),
  business_detail: BusinessDetailSchema.optional(),
  mobile_number: PhoneNumberSchema.optional(),
  phone_number: PhoneNumberSchema.optional(),
  email: z.string().min(1).max(50).nullable().optional(),
  addresses: StandardAddressSchema.optional(),
  kyc_documents: z.array(KycDocumentsObjectSchema).optional(),
  description: DescriptionSchema.optional(),
  date_of_registration: DateofRegistrationSchema.optional(),
  domicile_of_registration: z.string().min(2).max(2).optional(),
  metadata: MetadataSchema.optional(),
});
