import * as z from 'zod';

import { ErrorResponseSchema, MetadataSchema, PhoneNumberSchema } from './schema';

export type Metadata = z.infer<typeof MetadataSchema>;
export type PhoneNumber = z.infer<typeof PhoneNumberSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
