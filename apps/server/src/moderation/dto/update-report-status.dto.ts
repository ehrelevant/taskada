import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateReportStatusSchema = z.object({
  status: z.enum(['open', 'under_review', 'resolved', 'dismissed']),
  notes: z.string().optional(),
});

export class UpdateReportStatusDto extends createZodDto(UpdateReportStatusSchema) {}
