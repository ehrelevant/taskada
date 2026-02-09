import { array, InferOutput, minLength, number, object, optional, pipe, string } from 'valibot';

export const CreateRequestSchema = object({
  serviceTypeId: string(),
  serviceId: optional(string()),
  description: pipe(string(), minLength(10, 'Description must be at least 10 characters')),
  latitude: number(),
  longitude: number(),
  addressLabel: pipe(string(), minLength(5, 'Please enter a valid address')),
  imageUrls: optional(array(string())),
});

export type CreateRequestDto = InferOutput<typeof CreateRequestSchema>;
