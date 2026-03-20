import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateBookingSchema = z.object({
  requestId: z.string().uuid(),
  serviceId: z.string().uuid(),
});

export class CreateBookingDto extends createZodDto(CreateBookingSchema) {}