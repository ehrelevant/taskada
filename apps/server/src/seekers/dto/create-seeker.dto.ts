import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateSeekerSchema = z.object({
  userId: z.string().uuid(),
});

export class CreateSeekerDto extends createZodDto(CreateSeekerSchema) {}