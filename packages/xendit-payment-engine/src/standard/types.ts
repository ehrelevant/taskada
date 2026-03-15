import * as z from 'zod';

import { ErrorResponseSchema, JSONField, MetadataSchema, PhoneNumberSchema } from './schema';

export type Metadata = z.infer<typeof MetadataSchema>;
export type PhoneNumber = z.infer<typeof PhoneNumberSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type JSONValue = z.infer<typeof JSONField>;
