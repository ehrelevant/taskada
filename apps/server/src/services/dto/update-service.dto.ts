import { createZodDto } from 'nestjs-zod';

import { CreateServiceSchema } from "./create-service.dto";

export const UpdateServiceSchema = CreateServiceSchema.partial();

export class UpdateServiceDto extends createZodDto(UpdateServiceSchema) {}