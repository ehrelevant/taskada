import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateRequestSchema = z.object({
  serviceTypeId: z.string(),
  serviceId: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  latitude: z.number(),
  longitude: z.number(),
  addressLabel: z.string().min(5, 'Please enter a valid address'),
  imageUrls: z.array(z.string()).optional(),
});

export class CreateRequestDto extends createZodDto(CreateRequestSchema) {}
