import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateRequestSchema = z
  .object({
    serviceTypeId: z.string().uuid(),
    serviceId: z.string().uuid().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    latitude: z.number(),
    longitude: z.number(),
    addressLabel: z.string().min(5, 'Please enter a valid address'),
    imageUrls: z.array(z.string()).optional(),
  })
  .partial();

export class UpdateRequestDto extends createZodDto(UpdateRequestSchema) {}
