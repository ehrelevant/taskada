import { z } from 'zod';

export const proposalFormSchema = z.object({
  requestId: z.string({
    error: issue => (issue.input === undefined ? 'Request ID is required' : 'Request ID is invalid'),
  }),
  serviceId: z.string({
    error: issue => (issue.input === undefined ? 'Service ID is required' : 'Service ID is invalid'),
  }),
  cost: z
    .number({ error: issue => (issue.input === undefined ? 'Cost is required' : 'Cost must be a number') })
    .min(1, 'Cost must be at least 1'),
  specifications: z
    .string({
      error: issue => (issue.input === undefined ? 'Specifications are required' : 'Specifications are invalid'),
    })
    .min(10, 'Please provide at least 10 characters of specifications')
    .max(1000, 'Specifications are too long'),
});

export type ProposalFormData = z.infer<typeof proposalFormSchema>;
