import { PartialType } from '@nestjs/swagger';

import { CreateSeekerSwaggerDto } from './create-seeker.dto';

export class UpdateSeekerSwaggerDto extends PartialType(CreateSeekerSwaggerDto) {}
