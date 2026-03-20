import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateReviewSchema = z.object({
  serviceId: z.string().uuid(),
  bookingId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export class CreateReviewDto extends createZodDto(CreateReviewSchema) {}
