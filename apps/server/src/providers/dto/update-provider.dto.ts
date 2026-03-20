import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateProviderSchema = z
  .object({
    userId: z.string().uuid(),
    agencyId: z.string().uuid().nullable().optional(),
    isAccepting: z.boolean().optional(),
  })
  .partial();

export class UpdateProviderDto extends createZodDto(UpdateProviderSchema) {}
