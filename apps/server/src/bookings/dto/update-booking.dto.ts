import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateBookingSchema = z.object({
  status: z.enum(['in_transit', 'serving', 'completed', 'cancelled']),
});

export class UpdateBookingDto extends createZodDto(UpdateBookingSchema) {}
