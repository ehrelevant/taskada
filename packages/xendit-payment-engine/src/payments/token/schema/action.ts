import * as z from 'zod';

export const ActionSchema = z
  .object({
    type: z.enum(['PRESENT_TO_CUSTOMER', 'REDIRECT_CUSTOMER', 'API_POST_REQUEST']).optional().meta({
      description: 'The type of action that merchant system will need to handle to complete payment.',
      example: 'PRESENT_TO_CUSTOMER',
    }),
    descriptor: z
      .enum([
        'CAPTURE_PAYMENT',
        'PAYMENT_CODE',
        'QR_STRING',
        'VIRTUAL_ACCOUNT_NUMBER',
        'WEB_URL',
        'DEEPLINK_URL',
        'VALIDATE_OTP',
        'RESEND_OTP',
      ])
      .optional()
      .meta({
        description: 'Human readable descriptor for the action (if any).',
        example: 'Open payment sheet',
      }),
    value: z.string('Invalid value').optional().meta({
      description: 'The specific value that will be used by merchant to complete the action',
    }),
  })
  .meta({
    description:
      'Actions object contains possible next steps merchants can take to proceed with payment collection from end user.',
    example: [{ type: 'PRESENT_TO_CUSTOMER', descriptor: 'Open payment sheet' }],
  });
