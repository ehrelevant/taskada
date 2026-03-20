import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SubmitProposalSchema = z.object({
  cost: z.number().min(0, 'Cost must be a positive number'),
  specifications: z.string().min(1, 'Specifications cannot be empty'),
});

export class SubmitProposalDto extends createZodDto(SubmitProposalSchema) {}
