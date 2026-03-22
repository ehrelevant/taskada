import { z } from 'zod';

export const requestFormSchema = z.object({
  serviceTypeId: z.string({
    error: issue => (issue.input === undefined ? 'Service type is required' : 'Invalid service type'),
  }),
  serviceId: z.string().optional(),
  description: z
    .string({ error: issue => (issue.input === undefined ? 'Description is required' : 'Invalid description') })
    .min(10, 'Please describe your request in at least 10 characters')
    .max(1000, 'Description is too long'),
  latitude: z.number({ error: issue => (issue.input === undefined ? 'Location is required' : 'Invalid location') }),
  longitude: z.number({ error: issue => (issue.input === undefined ? 'Location is required' : 'Invalid location') }),
  addressLabel: z
    .string({ error: issue => (issue.input === undefined ? 'Address is required' : 'Invalid address') })
    .min(5, 'Please enter a valid address'),
});

export type RequestFormData = z.infer<typeof requestFormSchema>;
