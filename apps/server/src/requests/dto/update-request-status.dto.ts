import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateRequestStatusSchema = z.object({
  status: z.union([z.literal('pending'), z.literal('settling')]),
});

export class UpdateRequestStatusDto extends createZodDto(UpdateRequestStatusSchema) {}
