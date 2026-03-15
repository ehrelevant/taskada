import * as z from 'zod';

export const KycDocumentsObjectSchema = z
  .object({
    country: z.string().min(2).max(2).meta({ description: 'ISO 3166-1 alpha-2 Country Code' }),
    type: z
      .enum([
        'BIRTH_CERTIFICATE',
        'BANK_STATEMENT',
        'DRIVING_LICENSE',
        'IDENTITY_CARD',
        'PASSPORT',
        'VISA',
        'BUSINESS_REGISTRATION',
        'BUSINESS_LICENSE',
      ])
      .meta({ description: 'Generic ID type' }),
    sub_type: z
      .enum([
        'NATIONAL_ID',
        'CONSULAR_ID',
        'VOTER_ID',
        'POSTAL_ID',
        'RESIDENCE_PERMIT',
        'TAX_ID',
        'STUDENT_ID',
        'MILITARY_ID',
        'MEDICAL_ID',
        'OTHERS',
      ])
      .meta({ description: 'Specific ID type for IDENTITY_CARD types' }),
    document_name: z
      .string()
      .regex(/^[a-zA-Z0-9 ]{0,255}$/)
      .meta({ description: 'Free text description of the type of document' }),
    document_number: z
      .string()
      .regex(/^[a-zA-Z0-9]{0,255}$/)
      .meta({ description: 'Unique alphanumeric identity document number or code' }),
    expires_at: z.string().nullable().optional().meta({ description: 'Expiry date, if relevant' }),
    holder_name: z
      .string()
      .regex(/^[a-zA-Z0-9 ]{0,255}$/)
      .meta({ description: 'Full name(s) of the individual or business as defined on the document' }),
    document_images: z
      .array(z.string())
      .meta({ description: 'Array of file ids representing images of the document, in png/jpg/jpeg/pdf format' }),
  })
  .meta({ description: 'KYC document object', example: { type: 'PASSPORT', document_number: 'A1234567' } });
