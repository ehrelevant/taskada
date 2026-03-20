import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RegisterTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  platform: z.string().min(1, 'Platform is required'),
});

export class RegisterTokenDto extends createZodDto(RegisterTokenSchema) {}

export const UnregisterTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export class UnregisterTokenDto extends createZodDto(UnregisterTokenSchema) {}
