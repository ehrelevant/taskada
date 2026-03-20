import { createZodDto } from 'nestjs-zod';

import { CreateServiceSchema } from './create-service.dto';

export const CreateProviderServiceSchema = CreateServiceSchema.omit({ providerUserId: true });

export class CreateProviderServiceDto extends createZodDto(CreateProviderServiceSchema) {}