import { z } from 'zod';

export const proposalFormSchema = z.object({
  requestId: z.string({ required_error: 'Request ID is required' }),
  serviceId: z.string({ required_error: 'Service is required' }),
  cost: z.number({ invalid_type_error: 'Cost must be a number' }).min(1, 'Cost must be at least 1'),
  specifications: z
    .string({ required_error: 'Specifications are required' })
    .min(10, 'Please provide at least 10 characters of specifications')
    .max(1000, 'Specifications are too long'),
});

export type ProposalFormData = z.infer<typeof proposalFormSchema>;
