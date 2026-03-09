import * as v from 'valibot';

import { ErrorResponseSchema, MetadataSchema, PhoneNumberSchema } from './schema';

export type Metadata = v.InferInput<typeof MetadataSchema>;
export type PhoneNumber = v.InferInput<typeof PhoneNumberSchema>;
export type ErrorResponse = v.InferInput<typeof ErrorResponseSchema>;
