import * as v from "valibot";

import {
    BusinessDetailSchema,
    CreateCustomerRequestSchema,
    CustomerIdFieldSchema,
    CustomerSchema,
    DateofRegistrationSchema,
    DescriptionSchema,
    EmploymentSchema,
    GetCustomerListRequestSchema,
    GetCustomerListResponseSchema,
    GetCustomerRequestSchema,
    IdentityAccountSchema,
    IndividualDetailSchema,
    KycDocumentsObjectSchema,
    StandardAddressSchema,
    UpdateCustomerRequestSchema,
} from "./schema";

export type Employment = v.InferInput<typeof EmploymentSchema>;
export type IndividualDetail = v.InferInput<typeof IndividualDetailSchema>;
export type BusinessDetail = v.InferInput<typeof BusinessDetailSchema>;
export type Customer = v.InferInput<typeof CustomerSchema>;
export type IdentityAccount = v.InferInput<typeof IdentityAccountSchema>;
export type KycDocumentsObject = v.InferInput<typeof KycDocumentsObjectSchema>;
export type StandardAddress = v.InferInput<typeof StandardAddressSchema>;
export type GetCustomerRequest = v.InferInput<typeof GetCustomerRequestSchema>;
export type GetCustomerListRequest = v.InferInput<typeof GetCustomerListRequestSchema>;
export type GetCustomerListResponse = v.InferInput<typeof GetCustomerListResponseSchema>;
export type CreateCustomerRequest = v.InferInput<typeof CreateCustomerRequestSchema>;
export type DateofRegistration = v.InferInput<typeof DateofRegistrationSchema>;
export type Description = v.InferInput<typeof DescriptionSchema>;
export type UpdateCustomerRequest = v.InferInput<typeof UpdateCustomerRequestSchema>;
export type CustomerIdField = v.InferInput<typeof CustomerIdFieldSchema>;
