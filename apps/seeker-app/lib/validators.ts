import { type InferOutput, maxLength, minLength, number, object, optional, pipe, string } from 'valibot';

export const requestFormSchema = object({
  serviceTypeId: string('Service type is required'),
  serviceId: optional(string()),
  description: pipe(
    string('Description is required'),
    minLength(10, 'Please describe your request in at least 10 characters'),
    maxLength(1000, 'Description is too long'),
  ),
  latitude: number('Invalid location'),
  longitude: number('Invalid location'),
  addressLabel: pipe(string('Address is required'), minLength(5, 'Please enter a valid address')),
});

export type RequestFormData = InferOutput<typeof requestFormSchema>;
