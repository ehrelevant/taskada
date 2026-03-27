import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateServiceSchema = z.object({
  serviceTypeId: z.string().uuid(),
  providerUserId: z.string().uuid(),
  initialCost: z.number(),
  isEnabled: z.boolean().optional(),
});

export class CreateServiceDto extends createZodDto(CreateServiceSchema) {}
