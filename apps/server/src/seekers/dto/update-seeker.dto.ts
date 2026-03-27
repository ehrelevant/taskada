import { createZodDto } from 'nestjs-zod';

import { CreateSeekerSchema } from './create-seeker.dto';

export const UpdateSeekerSchema = CreateSeekerSchema.partial();

export class UpdateSeekerDto extends createZodDto(UpdateSeekerSchema) {}
