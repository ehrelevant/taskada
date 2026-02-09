import { PartialType } from '@nestjs/swagger';

import { CreateRequestSwaggerDto } from './create-request-swagger.dto';

export class UpdateRequestSwaggerDto extends PartialType(CreateRequestSwaggerDto) {}
