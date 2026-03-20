import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  avatarUrl: z.string().optional(),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
