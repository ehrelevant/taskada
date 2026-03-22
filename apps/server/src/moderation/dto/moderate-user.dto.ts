import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ModerateUserSchema = z.object({
  action: z.enum(['ban', 'suspend', 'warn']),
  durationDays: z.number().int().min(1).max(365).optional(),
  message: z.string().max(500).optional(),
});

export class ModerateUserDto extends createZodDto(ModerateUserSchema) {}
