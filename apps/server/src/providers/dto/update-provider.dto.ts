import { PartialType } from '@nestjs/swagger';

import { CreateProviderSwaggerDto } from './create-provider.dto';

export class UpdateProviderSwaggerDto extends PartialType(CreateProviderSwaggerDto) {}
