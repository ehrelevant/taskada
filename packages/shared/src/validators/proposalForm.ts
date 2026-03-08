import { type InferOutput, maxLength, minLength, minValue, number, object, pipe, string } from 'valibot';

export const proposalFormSchema = object({
  requestId: string('Request ID is required'),
  serviceId: string('Service is required'),
  cost: pipe(number('Cost must be a number'), minValue(1, 'Cost must be at least 1')),
  specifications: pipe(
    string('Specifications are required'),
    minLength(10, 'Please provide at least 10 characters of specifications'),
    maxLength(1000, 'Specifications are too long'),
  ),
});

export type ProposalFormData = InferOutput<typeof proposalFormSchema>;
