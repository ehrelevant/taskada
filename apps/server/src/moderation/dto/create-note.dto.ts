import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateNoteSchema = z.object({
  content: z.string().min(1).max(2000),
});

export class CreateNoteDto extends createZodDto(CreateNoteSchema) {}
