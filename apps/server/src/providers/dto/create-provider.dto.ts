import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateProviderSchema = z.object({
  userId: z.string().uuid(),
  agencyId: z.string().uuid().nullable().optional(),
  isAccepting: z.boolean().optional(),
});

export class CreateProviderDto extends createZodDto(CreateProviderSchema) {}

export const UpdateProviderSchema = CreateProviderSchema.partial();

export class UpdateProviderDto extends createZodDto(UpdateProviderSchema) {}
