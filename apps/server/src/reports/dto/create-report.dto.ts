import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateReportSchema = z.object({
  reportedUserId: z.string().uuid(),
  bookingId: z.string().uuid(),
  reason: z.enum([
    'harassment',
    'fraudulent_payment',
    'unfair_cancellation',
    'no_show',
    'inappropriate_behavior',
    'poor_service',
    'other',
  ]),
  description: z.string().optional(),
});

export class CreateReportDto extends createZodDto(CreateReportSchema) {}
