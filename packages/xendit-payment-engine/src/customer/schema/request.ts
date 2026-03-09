import * as v from 'valibot';
import { MetadataSchema } from '@standard/schema';
import { PhoneNumberSchema } from '@standard/schema/phone_number';

import { BusinessDetailSchema } from './business_detail';
import { DateofRegistrationSchema, DescriptionSchema } from './customer';
import { IndividualDetailSchema } from './individual_detail';
import { KycDocumentsObjectSchema } from './kyc_document';
import { StandardAddressSchema } from './address';

export const GetCustomerRequestSchema = v.object({
  customer_id: v.pipe(v.string(), v.maxLength(41)),
});

export const GetCustomerListRequestSchema = v.object({
  reference_id: v.pipe(v.string(), v.regex(/^[a-zA-Z0-9]{1,255}$/)),
});

export const CreateCustomerRequestSchema = v.object({
  individual_detail: IndividualDetailSchema,
  business_detail: BusinessDetailSchema,
  mobile_number: PhoneNumberSchema,
  phone_number: PhoneNumberSchema,
  email: v.nullable(v.pipe(v.string(), v.minLength(1), v.maxLength(50), v.description('E-mail address of customer'))),
  addresses: StandardAddressSchema,
  kyc_documents: v.array(KycDocumentsObjectSchema),
  description: DescriptionSchema,
  date_of_registration: DateofRegistrationSchema,
  domicile_of_registration: v.pipe(
    v.string(),
    v.regex(/^[A-Z]{2}$/),
    v.description(
      "Country within which the account that the shopper had to create/sign up on the merchant's website resides (e.g. accounts created on Shopee SG have SG as the value for this field. ISO 3166-2 Country Code",
    ),
  ),
  metadata: MetadataSchema,
});

export const UpdateCustomerRequestSchema = v.object({
  individual_detail: v.optional(IndividualDetailSchema),
  business_detail: v.optional(BusinessDetailSchema),
  mobile_number: v.optional(PhoneNumberSchema),
  phone_number: v.optional(PhoneNumberSchema),
  email: v.optional(v.nullable(v.pipe(v.string(), v.minLength(1), v.maxLength(50)))),
  addresses: v.optional(StandardAddressSchema),
  kyc_documents: v.optional(v.array(KycDocumentsObjectSchema)),
  description: v.optional(DescriptionSchema),
  date_of_registration: v.optional(DateofRegistrationSchema),
  domicile_of_registration: v.optional(v.pipe(v.string(), v.minLength(2), v.maxLength(2))),
  metadata: v.optional(MetadataSchema),
});
