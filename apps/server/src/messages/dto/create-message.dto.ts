import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  imageKeys: z.array(z.string()).default([]),
});

export class CreateMessageDto extends createZodDto(CreateMessageSchema) {}
