import { PartialType } from '@nestjs/swagger';

import { CreateServiceSwaggerDto } from './create-service.dto';

export class UpdateServiceSwaggerDto extends PartialType(CreateServiceSwaggerDto) {}
