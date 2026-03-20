import { z } from 'zod';

export const requestFormSchema = z.object({
  serviceTypeId: z.string({ required_error: 'Service type is required' }),
  serviceId: z.string().optional(),
  description: z
    .string({ required_error: 'Description is required' })
    .min(10, 'Please describe your request in at least 10 characters')
    .max(1000, 'Description is too long'),
  latitude: z.number({ invalid_type_error: 'Invalid location' }),
  longitude: z.number({ invalid_type_error: 'Invalid location' }),
  addressLabel: z.string({ required_error: 'Address is required' }).min(5, 'Please enter a valid address'),
});

export type RequestFormData = z.infer<typeof requestFormSchema>;
